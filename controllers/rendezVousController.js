const RendezVous = require("../models/RendezVous");
const planningController = require("../controllers/planningController");
const Utilisateur = require("../models/Utilisateur");
const rendezvousService = require("../services/rendezvousService");
const planningService = require("../services/planningService");
const Time = require("../shared/Time");
const Reparation = require("../models/Reparation");

exports.getAllRendezVous = async (req, res) => {
    try {
        await RendezVous.find({
            etat: 5
        })
        .lean()
        .populate("mecanicien_id")
        .populate("service_id")
        .populate("client_id")
        .then((rendezvous) => {
            console.log(rendezvous);
            res.json(rendezvous);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRendezVousById = async (req,res) =>{
    try{
        const {_idRendezvous} = req.body;
        RendezVous.findById(_idRendezvous)
        .lean()
        .populate({
            path : "mecanicien_id",
            select : "nom prenom"
        })
        .populate({
            path : "client_id",
            select : "nom prenom contact"
        })
        .populate({
            path : "service_id",
            select : "libelle duree"
        })
        .populate({
            path : "id_voiture",
            select : "immatriculation modele marque" 
        })
        .then((rendezvous) =>{
            res.json(rendezvous);
        });

    }catch(error){
        res.status(500).json({message : error.message});
    }
}


// rendez vous pour client
exports.getFuturRendezVousClient = async(req, res) => {
    try{
        const {idClient} = req.params;
        const dateAjd = new Date();
        dateAjd.setHours(0,0,0);        
        
        const listeRendezVous = await RendezVous.find({
            client_id: idClient, 
            etat : {$gte : 5},
            dateRendezVous: { $gte: dateAjd } 
        })
        .lean()
        .populate("mecanicien_id")
        .populate("service_id")
        .populate("client_id");

        if (!listeRendezVous || listeRendezVous.length === 0) {
            return res.json([]);
        }

        res.json(listeRendezVous);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

// update rendez vous
exports.updateRendezVous = async(req,res) =>{
    try {
        const {_id,date_rdv,heure_rdv,mecanicien_id} = req.body;
        
        const timeHeure = planningService.convertMinToTime(heure_rdv[0]);

        const filter = {_id : _id};
        
        const fieldUpdate = {
            mecanicien_id : mecanicien_id,
            date_rdv : date_rdv,
            heure_rdv : timeHeure
        }

        const rendezvous = await RendezVous.findOneAndUpdate(filter,fieldUpdate);
        rendezvous.save();
        res.status(200).json("Mise à jour effectué");
        console.log(rendezvous);

    } catch (error) {
        res.status(400).json({message : "Erreur dans la modification : "  + error});
    }
}



// rendez vous pour manager et mecanicien
exports.getRendezVousEmploye = async(req,res) =>{
    try{
        let listeRendezVous = [];
        const {idEmploye} = req.params;
        console.log(idEmploye);
        
        const roleUtilisateur = await Utilisateur.findOne({ _id : idEmploye })
        .select('_id')
        .populate({
            path: "profil_id",
            select : "libelle"
        });

        // console.log(roleUtilisateur);

        const libelle = roleUtilisateur?.profil_id?.libelle?.toLowerCase();
        console.log("libelle role : " + libelle);

        if(libelle === "mécanicien"){
            listeRendezVous = await rendezvousService.getRendezVousMecanicien(idEmploye);
            console.log("meca izy : " + listeRendezVous);
            res.json(listeRendezVous)
        }else if(libelle === "manager"){
            listeRendezVous = await rendezvousService.getRendezVousManager();
            console.log("manager izy : " + listeRendezVous);
            res.json(listeRendezVous);
        }

    }catch(error){
        res.status(500).json({message : error.message});
    }
}

exports.annulerRendezVous = async (req, res) => {
    try {
        const { id_rendezvous } = req.params;

        const rendezvous = await RendezVous.findOne({ _id: id_rendezvous });

        if (rendezvous.etat !== 5) {
            return res.status(400).json({ message: "Annulation impossible, l'état n'est pas correct." });
        }

        const rdvDate = new Date(rendezvous.date_rdv);
        const { hours, minutes } = rendezvous.heure_rdv;
        rdvDate.setHours(hours, minutes, 0, 0);

        const current_date = new Date();

        // console.log(rdvDate+" = "+current_date);
        if (rdvDate < current_date) {
            return res.status(400).json({ message: "Annulation impossible, le rendez-vous est déjà passé." });
        }

        rendezvous.etat = 0;
        await rendezvous.save();

        res.status(200).json({ message : "Rendez-vous annulé avec succès."});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// rendez vous rehatra anle client
exports.getRendezVousClient = async(req, res) => {
    try{
        const {idClient} = req.params;     
        
        const listeRendezVous = await RendezVous.find({
            client_id: idClient, 
        })
        .lean()
        .populate("mecanicien_id")
        .populate("service_id")
        .populate("client_id")
        .populate("id_voiture");

        if (!listeRendezVous || listeRendezVous.length === 0) {
            return res.json([]);
        }

        res.json(listeRendezVous);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}
 
exports.findReparationForRendezVous = async(req,res) => {
    try{
        const {id_rendezvous} = req.params;
        const reparation = await Reparation.findOne({rendez_vous_id:id_rendezvous}).populate("detail_reparation_id");
        res.json(reparation);
    }catch(error){
        res.status(500).json({message : error.message});
    }
}

const RendezVous = require("../models/RendezVous");
const planningController = require("../controllers/planningController");
const Utilisateur = require("../models/Utilisateur");

exports.getAllRendezVous = async (req, res) => {
    try {
        RendezVous.find()
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

// rendez vous pour client
exports.getFuturRendezVousClient = async(req, res) => {
    try{
        const {idClient} = req.params;
        const dateAjd = new Date();
        dateAjd.setHours(0,0,0);        
        
        const listeRendezVous = await RendezVous.find({
            client_id: idClient, 
            dateRendezVous: { $gte: dateAjd } 
        })
        .lean()
        .populate("mecanicien_id")
        .populate("service_id")
        .populate("client_id");

        if (!listeRendezVous || listeRendezVous.length === 0) {
            return res.json("Aucun rendez-vous trouvé");
        }

        res.json(listeRendezVous);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

// rendez vous mécanicien
exports.getRendezVousSemaineMecanicien = async(req,res) =>{
    try{
        const {idMecanicien} = req.params;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayOfWeek = new Date(today);
        const dayOfWeek = today.getDay();
        const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // Si dimanche (0), on ajuste à -6, sinon à 1
        firstDayOfWeek.setDate(today.getDate() + diffToMonday);
        firstDayOfWeek.setHours(0, 0, 0, 0); 

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 5); 
        lastDayOfWeek.setHours(12, 59, 59, 999); 

        const listeRendezVous = await RendezVous.find({
            mecanicien_id : idMecanicien, 
            date_rdv: { $gte: firstDayOfWeek, $lte: lastDayOfWeek }, // Plage de dates entre lundi et vendredi
            etat : 5
        })
        .lean()
        .populate("client_id")
        .populate("service_id");
        
        if (!listeRendezVous || listeRendezVous.length === 0) {
            return res.json("Aucun rendez-vous trouvé");
        }
        res.json(listeRendezVous);

    }catch(error){
        res.status(500).json({message : error.message});
    }
}


// liste rendez vous côté manager
exports.getRendezVousSemaineManager = async(req,res) =>{
    try {
        const listeRendezVous = [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayOfWeek = new Date(today);
        const dayOfWeek = today.getDay();
        const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // Si dimanche (0), on ajuste à -6, sinon à 1
        firstDayOfWeek.setDate(today.getDate() + diffToMonday);
        firstDayOfWeek.setHours(0, 0, 0, 0); 

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 5); 
        lastDayOfWeek.setHours(12, 59, 59, 999);

        const allUtilisateur = await Utilisateur.find()
        .select("_id nom prenom profil_id")
        .populate({
            path : "profil_id",
            select : "_id libelle"
        },);
        const mecaniciens = allUtilisateur.filter(
            (meca) => meca.profil_id.libelle === "Mécanicien"
        );

        for (const meca of mecaniciens) {

            const rdv = {
                mecanicien : meca,
                rendez_vous_semaine : []
            };

            const rendezVousForMeca = await RendezVous.find({
                mecanicien_id: meca._id,
                date_rdv: { $gte: firstDayOfWeek, $lte: lastDayOfWeek },
                etat : 5
            })
            .select("_id client_id heure_rdv date_rdv etat service_id id_voiture")
            .lean()
            .populate({
                path : "client_id",
                select : "_id nom prenom contact"
            })
            .populate({
                path: "service_id",
                select : "_id libelle duree"
            })
            .populate({
                path : "id_voiture",
                select : "_id immatriculation modele marque"
            });

            rdv.rendez_vous_semaine.push(rendezVousForMeca);
            listeRendezVous.push(rdv);
        }

        if (!listeRendezVous || listeRendezVous.length === 0) {
            return res.json("Aucun rendez-vous trouvé");
        }

        res.json(listeRendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
 }


 

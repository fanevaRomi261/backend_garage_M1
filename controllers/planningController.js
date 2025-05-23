const RendezVous = require("../models/RendezVous");
const Utilisateur = require("../models/Utilisateur");
const Service = require("../models/Service");
const planningService = require('../services/planningService');

// ############------------- Controller ------------------############### \\
 
exports.getAllMecanicien = async (req, res) => {
    try {
        const mecaniciens = await planningService.getAllMecanicien();
        res.json(mecaniciens);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


exports.getRendezVousFromDate = async (req, res) => {
    try {
        const { date_rdv } = req.body;
        const allRendezVous = await planningService.getRendezVousByDate(date_rdv);
        res.json(allRendezVous);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


exports.getCreneauPossibleJournee = async (req,res) =>{
    try {
        const { service_id,date_rdv } = req.body;
        const result = await planningService.trierCreneauPossibleJour(date_rdv,service_id);
        res.json(result);
    } catch (error) {
        res.status(500).send({message : error.message});
    }
}


exports.getTempsLibreMecanicien = async (req, res) => {
    try{
        const { date_rdv , id_rendezvous , service_id , creneauChoisi } = req.body;
        
        // ty mandeha tsara //
        // await planningService.getAllRendezVousMecanicienByDate(date_rdv)
        // .then((result) => { 
        //     console.log(result[0]);
        //     res.json(planningService.findCreneauLibreMecanicien(result[0]))
        //     // res.json(result);
        // })
        // .catch((error) => {
        //     console.error(error);  // Si une erreur se produit
        // });

        // await planningService.creneauLibreAvecMecanicien(date_rdv).then((result) => {
        //     res.json(result);
        // })

        await planningService.getRendezVousSansModification(date_rdv,id_rendezvous).then((result) => {
            res.json(result);
        });


        // const result = await planningService.getChargeQuotidienneMecanicien(date_rdv);
        // res.json(result);

        // ty misy bug //
        // const toutCreneau = await planningService.creneauPossibleAvecMecanicien(service_id,date_rdv); 
        // res.json(toutCreneau);
        // for(const creneau of toutCreneau){
        //     console.log(creneau);
        // }


        // const result = await planningService.propositionMecanicienMoinsDeCharge(toutCreneau , creneauChoisi , date_rdv);
        // res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
};


exports.proposeChangementMecanicien = async (req,res) =>{
    try {
        const { date_rdv , id_rendezvous , creneauChoisi } = req.body;
        const toutCreneauLibre = await planningService.creneauLibreAvecMecanicien(date_rdv,id_rendezvous);
        
        toutCreneauLibre.map((creneau) => {
            console.log(creneau);
        })
        // console.log(toutCreneauLibre);

        const mecaLibre = await planningService.propositionMecanicienPourService(toutCreneauLibre,creneauChoisi,date_rdv);
        return res.status(200).json(mecaLibre);
    } catch (error) {
        console.log(error.stack);
        res.status(500).send({message : error.message});
    }
}


exports.addRendezVous = async (req, res) => {
    try {
        const { client_id, creneauChoisi, date_rdv, service_id , id_voiture } = req.body;
        const toutCreneau = await planningService.creneauPossibleAvecMecanicien(service_id,date_rdv);
        const mecanicien_id = await planningService.propositionMecanicienMoinsDeCharge(toutCreneau , creneauChoisi , date_rdv);
        const etat = 5;
        const heure_rdv = planningService.convertMinToTime(creneauChoisi[0]);
    
        const newRendezVous = new RendezVous({
            client_id,
            mecanicien_id,
            date_rdv,
            heure_rdv,
            etat,
            service_id,
            id_voiture
        });

        await newRendezVous.save();
        res.status(201).json({message: "Rendez vous ajouté"});

    } catch (error) {
        res.status(400).json({ message:  "Erreur lors de l'ajout du rendez vous : " + error.message });
    }
};


const express = require("express");
const router = express.Router();
const RendezVous = require("../models/RendezVous");
const Utilisateur = require("../models/Utilisateur");

const getRendezVousByDate = async (date) => {
  if (!date || isNaN(Date.parse(date))) {
    throw new Error("Invalid or missing date format");
  }
  const parsedDate = new Date(date);
  return await RendezVous.find({ date_rdv: parsedDate })
    .lean()
    .populate("mecanicien_id")
    .populate("service_id")
    .populate("client_id");
};

const getAllMecanicien = async () => {
  const allUtilisateur = await Utilisateur.find().populate("profil_id");
  const mecaniciens = allUtilisateur.filter(
    (meca) => meca.profil_id.libelle === "Mécanicien"
  );
  return mecaniciens;
};

const convertTimeToMin = (time) => {
    const sumMinutes = time.hours * 60 + time.minutes;
    return sumMinutes;
};

const convertRendezVousEnIntervalle = (rendezVous) => {
    const heureRendezVous = convertTimeToMin(rendezVous.heure_rdv);
    const dureeRendezVous = convertTimeToMin(rendezVous.service_id.duree) + heureRendezVous;
    return [heureRendezVous, dureeRendezVous];
};


const getAllRendezVousMecanicienByDate = async (date) => {
    try {
        const allRendezVous = await RendezVous.find({ date_rdv: date }).populate('mecanicien_id').populate('service_id');
        const allMecanicien = await getAllMecanicien();
        const allMecanicienAvecRdv = [];
        
        for(const meca of allMecanicien){
            const mecanicienAvecRdv = {
                mecanicien: meca,
                rendez_vous: []
            }

            for(const rendezVous of allRendezVous){
                if(rendezVous.mecanicien_id._id.toString() === meca._id.toString()){
                    mecanicienAvecRdv.rendez_vous.push(convertRendezVousEnIntervalle(rendezVous))
                }
            }

            allMecanicienAvecRdv.push(mecanicienAvecRdv);
        }
        return allMecanicienAvecRdv;
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous :", error);
        throw error;
    }
};


const findCreneauLibreMecanicien = (mecanicien) => {
    const heureDebutMatin = 480; // 8h
    const heureFinMatin = 720; // 12h
    const heureDebutAprem = 840; // 14h
    const heureFinAprem = 1080; // 18h 

    let creneauxLibres = [];

    const rendezVousTries = mecanicien.rendez_vous.sort((a, b) => a[0] - b[0]);

    // verifie si il n'a pas de rendez vous toute la journée
    if (rendezVousTries.length === 0) {
        creneauxLibres.push([heureDebutMatin, heureFinMatin]);
        creneauxLibres.push([heureDebutAprem, heureFinAprem]);
        return creneauxLibres;
    }

    // Vérifie le créneau libre avant le premier rendez-vous du matin et l'heure de début
    if (rendezVousTries.length > 0 && rendezVousTries[0][0] > heureDebutMatin) {
        creneauxLibres.push([heureDebutMatin, rendezVousTries[0][0]]);
    }

    // Vérifie les créneaux libres entre les rendez-vous
    for (let i = 0; i < rendezVousTries.length - 1 ; i++) {
        const finRdvActuel = rendezVousTries[i][1];
        const debutRdvSuivant = rendezVousTries[i + 1][0];

        if (debutRdvSuivant > finRdvActuel) {
            if(debutRdvSuivant > heureFinMatin){
                creneauxLibres.push([finRdvActuel, ((heureFinMatin - finRdvActuel) + finRdvActuel) ]);
            }else{
                creneauxLibres.push([finRdvActuel, debutRdvSuivant]);
            }
        }
    }

    // Vérifie le créneau libre après le dernier rendez-vous du matin et la fin de l'heure le matin
    if (rendezVousTries.length > 0 && rendezVousTries[rendezVousTries.length - 1][1] < heureFinMatin) {
        creneauxLibres.push([rendezVousTries[rendezVousTries.length - 1][1], heureFinMatin]);
    }

    // Verifie si il est libre toute l'aprem
    if(rendezVousTries[rendezVousTries.length - 1][1] < heureDebutAprem){
        creneauxLibres.push([heureDebutAprem,heureFinAprem]);
    }

    // Vérifier les créneaux libres entre 14h et 18h (après-midi)
     for (let i = 0; i < rendezVousTries.length; i++) {
        const rdv = rendezVousTries[i];
        if (rdv[0] > heureDebutAprem && rdv[0] < heureFinAprem) {
            if (i === 0 || rendezVousTries[i - 1][1] < rdv[0]) {
                // Ajouter l'espace entre 14h et le début du premier rendez-vous
                creneauxLibres.push([heureDebutAprem, rdv[0]]);
            }
            if (i === rendezVousTries.length - 1 || rdv[1] < rendezVousTries[i + 1][0]) {
                // Ajouter l'espace entre la fin du rendez-vous et 18h
                creneauxLibres.push([rdv[1], heureFinAprem]);
            }
        }
    }

    return creneauxLibres;
};


const proposeMecanicien = ()=>{

}


exports.getAllMecanicien = async (req, res) => {
    try {
        const mecaniciens = getAllMecanicien();
        res.json(mecaniciens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

exports.getRendezVousFromDate = async (req, res) => {
    try {
        const { date_rdv } = req.body;
        const allRendezVous = await getRendezVousByDate(date_rdv);
        res.json(allRendezVous);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTempsLibreMecanicien = async (req, res) => {
    try{
        const { date_rdv } = req.body;
        
        getAllRendezVousMecanicienByDate(date_rdv)
        .then((result) => { 
            console.log(result[1]);
            res.json(findCreneauLibreMecanicien(result[1]))
        })
        .catch((error) => {
            console.error(error); // Si une erreur se produit
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.insertRendezVous = async (req, res) => {
    try {
        const { client_id, heure_rdv, date_rdv, service_id } = req.body;
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

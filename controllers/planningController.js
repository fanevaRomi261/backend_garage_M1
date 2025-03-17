const express = require("express");
const router = express.Router();
const RendezVous = require("../models/RendezVous");
const Utilisateur = require("../models/Utilisateur");


const getRendezVousByDate = async (date) => {
    if (!date || isNaN(Date.parse(date))) {
        throw new Error("Invalid or missing date format");
    }
    const parsedDate = new Date(date);
    return await RendezVous
        .find({ date_rdv: parsedDate })
        .lean()
        .populate("mecanicien_id")
        .populate("service_id")
        .populate("client_id");
};

const convertTimeToMin = (time) => {
    const sumMinutes = (time.hours * 60 ) + time.minutes;
    return sumMinutes;
}

const convertRendezVousEnIntervalle = (allRendezVous) =>{
    const dataTab = new Array();
    for(const rendezvous of allRendezVous){      
        const heureRendezVous = convertTimeToMin(rendezvous.heure_rdv);
        const dureeRendezVous = convertTimeToMin(rendezvous.service_id.duree) + heureRendezVous;
        dataTab.push([heureRendezVous,dureeRendezVous]);
    };
    console.log(dataTab);
}

const findCreneauLibre = (tabIntervalles) =>{
    const heureDebutMatin = 480; // 8h
    const heureFinMatin = 720; // 12h
    const heureDebutAprem = 840; // 14h
    const heureFinAprem = 1080; // 18h

    
}



exports.getAllMecanicien = async(req,res) => {
    try{
        const allUtilisateur = await Utilisateur.find().populate("profil_id");
        const mecaniciens = allUtilisateur.filter(meca => meca.profil_id.libelle === "Mécanicien");
        res.json(mecaniciens);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getAllRendezVous = async(req,res) => {
    try{
        RendezVous
        .find()
        .lean()
        .populate("mecanicien_id")
        .populate("service_id")
        .populate("client_id")
        .then(rendezvous => {
            console.log(rendezvous);
            res.json(rendezvous);
        });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

exports.getRendezVousFromDate = async(req,res) => {
    try {
        const {date_rdv} = req.body;
        const allRendezVous = await getRendezVousByDate(date_rdv);
        res.json(allRendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getTempsLibreMecanicien = async(req, res) =>{
    try {
        const {date_rdv} = req.body;
        
        const allRendezVous = await getRendezVousByDate(date_rdv);
        const intervalles = convertRendezVousEnIntervalle(allRendezVous);
        findCreneauLibre(intervalles);

        res.json(convertTimeToMin(allRendezVous[0].heure_rdv));        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.insertRendezVous = async(req,res) =>{
    try {
        const {client_id,heure_rdv,date_rdv,service_id} = req.body;

    } catch (error) {
        res.status(400).json({message : error.message});
    }
}


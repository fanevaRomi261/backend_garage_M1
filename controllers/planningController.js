const express = require("express");
const router = express.Router();
const RendezVous = require("../models/RendezVous");
const Utilisateur = require("../models/Utilisateur");


exports.getAllMecanicien = async(req,res) => {
    try{
        const allUtilisateur = await Utilisateur.find().populate("profil_id");
        const mecaniciens = allUtilisateur.filter(meca => meca.profil_id.libelle === "Mécanicien");
        res.json(mecaniciens);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getTempsLibreMecanicien = async(req, res) =>{
    try {
        const {date_rdv} = req.body;
        const mecas = await this.getAllMecanicien();
        
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


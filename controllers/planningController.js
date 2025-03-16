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


    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


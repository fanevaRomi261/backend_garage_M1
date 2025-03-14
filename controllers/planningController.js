const express = require("express");
const router = express.Router();
const RendezVous = require("../models/RendezVous");
const Utilisateur = require("../models/Utilisateur");
const Profil = require("../models/Profil");

const findMecanicienLibre = async(date) =>{
    const profil = await Profil.findOne({libelle: 'Mécanicien'});
    const mecaniciens = await Utilisateur.find({profil_id: profil._id});
    for(meca in mecaniciens){
        console.log(meca.nom);
    }
};

const proposeHeureRendezVous = (date) =>{
    
} 


router.post("/add",async(req,res)=>{
    try{
        const rdv = new RendezVous(req.body);
        rdv.save();
        res.status(201).json(rdv);
    }catch(error){
        res.status(400).json({message: error.message});
    }
});


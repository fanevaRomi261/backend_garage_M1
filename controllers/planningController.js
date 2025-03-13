const express = require("express");
const router = express.Router();
const RendezVous = require("../models/RendezVous");

const findMecanicienLibre = (date) =>{

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


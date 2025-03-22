const express = require("express");
const Service = require("../models/Service");

exports.getAllService = async(req,res) =>{
    try{
        Service
        .find()
        .lean() // Convert Mongoose documents to plain JavaScript objects
        .then(services => {
          console.log(services);
          res.json(services); // This will now work without circular reference errors
        });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}
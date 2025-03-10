const express = require("express");
const Profil = require("../models/Profil");

// Récupérer tous les profils
exports.getProfils = async (req, res) => {
  try {
    const profiles = await Profil.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).send('Erreur selection profil');
  }
}
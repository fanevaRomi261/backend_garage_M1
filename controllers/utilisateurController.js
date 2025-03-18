const express = require("express");
const Utilisateur = require("../models/Utilisateur");

// Récupérer tous les profils
exports.getInfoUser = async (req, res) => {
  try {
    const utilisateur_id = req.params.id;

    const user = await Utilisateur.findById(utilisateur_id).populate('profil_id');
    user.pwd = null;

    res.json(user);
  } catch (err) {
    res.status(500).send('Erreur selection utilisateur');
  }
}
const express = require("express");
const TypeVehicule = require("../models/TypeVehicule");

// Récupérer tous les type vehicule
exports.getTypeVehicule = async (req, res) => {
  try {
    const typeVehicule = await TypeVehicule.find();
    res.json(typeVehicule);
  } catch (err) {
    res.status(500).send('Erreur selection type vehicule');
  }
}
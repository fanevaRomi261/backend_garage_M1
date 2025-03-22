const express = require("express");
const Piece = require("../models/Piece");

// Récupérer tous les pieces
exports.getPiece = async (req, res) => {
  try {
    const piece = await Piece.find();
    res.json(piece);
  } catch (err) {
    res.status(500).send('Erreur selection piece');
  }
}
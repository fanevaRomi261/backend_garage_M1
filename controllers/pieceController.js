const express = require("express");
const Piece = require("../models/Piece");

// Récupérer tous les pieces
exports.getPiece = async (req, res) => {
  try {
    const piece = await Piece.find().populate('type_vehicule_id');
    res.json(piece);
  } catch (err) {
    res.status(500).send('Erreur selection piece');
  }
}

exports.ajoutPiece = async (req, res) => {
  const { libelle, prix,type_vehicule_id } = req.body;

  if (!libelle || !type_vehicule_id || prix == undefined) {
    return res.status(400).json({message :'Tous les champs sont requis'});
  }

  if (prix <= 0) {
    return res.status(400).json({message :'Le prix doit être supérieur à zéro'});
  }

  try {
    const nouvellePiece = new Piece({
      libelle,
      type_vehicule_id,
      prix
    });

    await nouvellePiece.save();
    res.status(201).json(nouvellePiece);
  } catch (err) {
    res.status(500).json({message : 'Erreur lors de l\'ajout de la pièce'});
  }
};

exports.modifierPiece = async (req, res) => {
  // console.log(req.body);
  // console.log(req.params);
  const { libelle, prix, type_vehicule_id } = req.body;
  const { id } = req.params;

  if (!libelle || !type_vehicule_id || prix === undefined) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  if (prix <= 0) {
    return res.status(400).json({ message: 'Le prix doit être supérieur à zéro' });
  }

  try {
    const piece = await Piece.findById(id);

    // Vérifier si la pièce existe
    if (!piece) {
      return res.status(404).json({ message: 'Pièce non trouvée' });
    }

    piece.libelle = libelle;
    piece.prix = prix;
    piece.type_vehicule_id = type_vehicule_id;

    await piece.save();

    res.status(200).json(piece);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification de la pièce' });
  }
};


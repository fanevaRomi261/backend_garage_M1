const express = require("express");
const Stock = require("../models/Stock");
const DetailReparation = require("../models/DetailReparation");
const Reparation = require("../models/Reparation");
const pieceService = require("../services/pieceService");
const RendezVous = require("../models/RendezVous");
const mongoose = require("mongoose");
const Vehicule = require("../models/Vehicule");
const Piece = require("../models/Piece");

// entree
exports.ajouterEntreeStock = async (req, res) => {
  try {
    let { piece_id, date_entree, quantite } = req.body;

    if (quantite <= 0) {
      return res.status(400).json({ message: "La quantité doit supérieur à 0" });
    }
    const entree = new Stock({
      piece_id,
      date_entree,
      quantite,
    });
    console.log(JSON.stringify(entree));

    await entree.save();
    res.status(201).json({ message: "entrée de stock avec succès", entree });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// // sortie (ajout detail reparation) transaction
// exports.ajouterDetailReparation = async (req, res) => {
//   const session = await mongoose.startSession(); // Démarrer une session
//   try {
//     let { reparation_id, piece_id, quantite } = req.body;
//     session.startTransaction();

//     const resteEnStock = await pieceService.getStockRestantParPiece(piece_id);

//     const reparation = await Reparation.findById(reparation_id).session(
//       session
//     );
//     if (!reparation) {
//       throw new Error("Réparation non trouvée");
//     }

//     if (resteEnStock < quantite) {
//       throw new Error("Quantite insuffisante pour ce piece");
//     }

//     const prixPiece = await pieceService.getPrixPiece(piece_id);
//     const prixTotalPiece = prixPiece * quantite;

//     const detailReparation = new DetailReparation({
//       piece_id,
//       quantite,
//       prix_total: prixTotalPiece,
//     });

//     await detailReparation.save({ session });
//     reparation.detail_reparation_id.push(detailReparation._id);
//     await reparation.save({ session });

//     res.status(201).json({
//       message: "ajout detail reparation avec succès",
//       detailReparation,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({ message: "Erreur serveur", error: error.message });
//   } finally {
//     session.endSession();
//   }
// };

// test
exports.getStock = async (req, res) => {
  try {
    const rep = await pieceService.getStockRestant();
    res.json(rep);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// sortie (ajout detail reparation) transaction
exports.ajouterDetailReparation = async (req, res) => {
  try {
    let { reparation_id, piece_id, quantite } = req.body;

    if (quantite <= 0) {
      return res.status(400).json({ message: "La quantité doit supérieur à 0" });
    }

    const resteEnStock = await pieceService.getStockRestantParPiece(piece_id);

    const reparation = await Reparation.findById(reparation_id).populate('rendez_vous_id');
    // console.log(reparation);
    if (!reparation) {
      return res.status(404).json({ message: "Réparation non trouvée" });
    }

    const vehiculeId = reparation.rendez_vous_id.id_voiture;
    const vehicule = await Vehicule.findById(vehiculeId).populate('type_vehicule_id');

    const piece = await Piece.findById(piece_id);

    const typeVehiculePiece = piece.type_vehicule_id;
    const typeVehiculeVehicule = vehicule.type_vehicule_id._id;

    if (!typeVehiculePiece.includes(typeVehiculeVehicule)) {
      return res.status(422).json({
        message: "Cette pièce n'est pas compatible avec ce type de véhicule",
      });
    }

    if (resteEnStock < quantite) {
      return res.status(422).json({ 
        message: "Quantité insuffisante pour ce pièce",
        stockRestant: resteEnStock,
        quantiteDemandee: quantite
      });
    }

    const prixPiece = await pieceService.getPrixPiece(piece_id);
    const prixTotalPiece = prixPiece * quantite;

    const detailReparation = new DetailReparation({
      piece_id,
      quantite,
      prix_total: prixTotalPiece,
    });

    await detailReparation.save();

    reparation.detail_reparation_id.push(detailReparation._id);
    //   reparation.detail_reparation_id.push("67d80b3e2f086f0b05def57f");
    await reparation.save();

    res.status(201).json({
      message: "ajout detail reparation avec succès",
      detailReparation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


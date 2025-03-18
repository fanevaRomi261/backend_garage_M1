const Piece = require("../models/Piece");
const Stock = require("../models/Stock");
const DetailReparation = require("../models/DetailReparation");
const mongoose = require('mongoose');

const getPrixPiece = async (piece_id) => {
  try {
    const piece = await Piece.findById(piece_id);

    if (!piece) {
      throw new Error("Pièce non trouvée");
    }
    // console.log(JSON.stringify(piece.prix));
    return piece.prix;
  } catch (err) {
    throw new Error(
      "Erreur lors de la récupération du prix de la pièce: " + err.message
    );
  }
};

const getStockRestant = async () => {
  try {
    const result = await Piece.aggregate([
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "piece_id",
          as: "entrees",
        },
      },
      {
        $addFields: {
          totalEntree: {
            $sum: {
              $map: {
                input: "$entrees",
                as: "entree",
                in: "$$entree.quantite",
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "detailreparations",
          localField: "_id",
          foreignField: "piece_id",
          as: "sorties",
        },
      },
      {
        $addFields: {
          totalSortie: {
            $sum: {
              $map: {
                input: "$sorties",
                as: "sortie",
                in: "$$sortie.quantite",
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "typevehicules",
          localField: "type_vehicule_id",
          foreignField: "_id",
          as: "typeVehicules",
        },
      },
      {
        $project: {
          _id: 0,
          piece_id: "$_id",
          libelle: 1,
          stockRestant: { 
            $subtract: [
              { $ifNull: ["$totalEntree", 0] }, 
              { $ifNull: ["$totalSortie", 0] }
            ],
          },
          typeVehicules: 1,
        },
      },
    ]);

    return result;
  } catch (error) {
    throw new Error("Erreur lors de l'agrégation : " + error.message);
  }
};

const getStockRestantParPiece = async (piece_id) => {
  try {
    const result = await Piece.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(piece_id),
        },
      },
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "piece_id",
          as: "entrees",
        },
      },
      {
        $addFields: {
          totalEntree: {
            $sum: {
              $map: {
                input: "$entrees",
                as: "entree",
                in: "$$entree.quantite",
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "detailreparations",
          localField: "_id",
          foreignField: "piece_id",
          as: "sorties",
        },
      },
      {
        $addFields: {
          totalSortie: {
            $sum: {
              $map: {
                input: "$sorties",
                as: "sortie",
                in: "$$sortie.quantite",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          stockRestant: {
            $subtract: [
              { $ifNull: ["$totalEntree", 0] },
              { $ifNull: ["$totalSortie", 0] },
            ],
          },
        },
      },
    ]);

    if (result.length === 0) {
      return 0;
    }

    return result[0].stockRestant;
  } catch (error) {
    throw new Error("Erreur lors de l'agrégation : " + error.message);
  }
};

module.exports = {
  getPrixPiece,
  getStockRestant,
  getStockRestantParPiece
};

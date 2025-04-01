const Utilisateur = require("../models/Utilisateur");
const Profil = require("../models/Profil");
const Reparation = require("../models/Reparation");
const DetailReparation = require("../models/DetailReparation");
const Piece = require("../models/Piece");

const getUserCounts = async (req, res) => {
  try {
    const profiles = await Profil.find({
      libelle: {
        $in: ["manager", "mécanicien", "client"].map(
          (libelle) => new RegExp(libelle, "i")
        ),
      },
    });

    if (profiles.length !== 3) {
      return res
        .status(404)
        .json({ message: "Un ou plusieurs profils introuvables." });
    }

    const [managerProfile, mecanicienProfile, clientProfile] = profiles;

    const totalUsersPromise = Utilisateur.countDocuments();
    const profileCountsPromises = [
      Utilisateur.countDocuments({ profil_id: managerProfile._id }),
      Utilisateur.countDocuments({ profil_id: mecanicienProfile._id }),
      Utilisateur.countDocuments({ profil_id: clientProfile._id }),
    ];

    const [totalUsers, managerCount, mecanicienCount, clientCount] =
      await Promise.all([totalUsersPromise, ...profileCountsPromises]);

    return res.json({
      totalUsers,
      managerCount,
      mecanicienCount,
      clientCount,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message: "Une erreur est survenue lors de la récupération des données.",
        error: err.message,
      });
  }
};

const getRepairsCountByMonth = async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    if (isNaN(year)) {
      return res.status(400).json({ message: "L'année fournie est invalide." });
    }

    const result = await Reparation.aggregate([
      {
        $match: {
          date_debut: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $addFields: {
          month: { $month: "$date_debut" },
        },
      },
      {
        $group: {
          _id: "$month", // Regrouper par mois
          count: { $sum: 1 }, // Compter le nombre de réparations pour chaque mois
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Compléter les mois sans réparations avec une valeur de 0
    const repairsPerMonth = [];
    for (let i = 1; i <= 12; i++) {
      const monthData = result.find((item) => item._id === i);
      repairsPerMonth.push({
        month: i,
        count: monthData ? monthData.count : 0,
      });
    }

    // Retourner les résultats dans la réponse
    return res.json({
      year,
      repairsPerMonth,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message:
          "Une erreur est survenue lors du calcul du nombre de réparations.",
        error: err.message,
      });
  }
};

const getTopSellingPiece = async (req, res) => {
  try {
    const result = await DetailReparation.aggregate([
      // Grouper par piece_id et calculer la somme totale des quantités
      {
        $group: {
          _id: "$piece_id", // Regrouper par pièce
          totalQuantity: { $sum: "$quantite" },
          totalPrice: { $sum: "$prix_total" },
        },
      },
      // Trier par quantité totale, du plus grand au plus petit
      {
        $sort: { totalQuantity: -1 },
      },
      // Limiter à 1 pour obtenir la pièce la plus vendue
      {
        $limit: 5,
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Aucune pièce vendue trouvée." });
    }

    const topPieces = await Promise.all(
      result.map(async (topPiece, index) => {
        const pieceDetails = await Piece.findById(topPiece._id);
        return {
          rank: index + 1,
          piece: pieceDetails,
          totalQuantity: topPiece.totalQuantity,
          totalPrice: topPiece.totalPrice,
        };
      })
    );

    return res.json({
      topPieces,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message:
          "Une erreur est survenue lors du calcul de la pièce la plus vendue.",
        error: err.message,
      });
  }
};

// Fonction pour obtenir le top 5 des clients avec le plus de réparations
const getTopClients = async (req, res) => {
  try {
    const topClients = await Reparation.aggregate([
      // Jointure avec la collection RendezVous
      {
        $lookup: {
          from: "rendezvous",
          localField: "rendez_vous_id",
          foreignField: "_id",
          as: "rendezvous_info",
        },
      },
      { $unwind: "$rendezvous_info" },
      {
        $group: {
          _id: "$rendezvous_info.client_id",
          totalReparations: { $sum: 1 },
        },
      },
      { $sort: { totalReparations: -1 } },
      { $limit: 5 },
      // Optionnel : Si vous voulez aussi les infos des clients, ajouter une jointure avec la collection Clients
      {
        $lookup: {
          from: "utilisateurs",
          localField: "_id",
          foreignField: "_id",
          as: "client_info",
        },
      },
      { $unwind: "$client_info" },
      {
        $project: {
          client_id: "$_id",
          totalReparations: 1,
          nom: "$client_info.nom",
          prenom: "$client_info.prenom",
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: topClients,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des top clients",
      error: error.message,
    });
  }
};

const getAverageRepairTime = async (req, res) => {
  try {
    const result = await Reparation.aggregate([
      {
        $match: {
          $expr: { $gt: ["$date_fin", "$date_debut"] }, // Vérifie que date_fin > date_debut
        },
      },
      {
        $project: {
          duration: { $subtract: ["$date_fin", "$date_debut"] },
        },
      },
      {
        $group: {
          _id: null,
          averageDuration: { $avg: "$duration" },
        },
      },
      {
        $project: {
          _id: 0,
          averageDurationMinutes: { $divide: ["$averageDuration", 1000 * 60] },
          averageDurationHours: {
            $divide: ["$averageDuration", 1000 * 60 * 60],
          },
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "Aucune réparation trouvée",
      });
    }

    res.status(200).json({ tempsMoyen: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du calcul du temps moyen de réparation",
      error: error.message,
    });
  }
};

const depenseMoyenneParReparation = async (req, res) => {
  try {
    const reparations = await Reparation.find({
      $expr: { $gt: ["$date_fin", "$date_debut"] }
    }).populate(
      "detail_reparation_id"
    );

    if (reparations.length === 0) {
      return res.status(404).json({ message: "Aucune réparation trouvée." });
    }

    let sommeTotale = 0;

    for (const reparation of reparations) {
      const coutMainDoeuvre = reparation.prix_main_doeuvre;

      const coutDetails = reparation.detail_reparation_id.reduce(
        (total, detail) => total + detail.prix_total,
        0
      );
      const coutTotalReparation = coutMainDoeuvre + coutDetails;
      sommeTotale += coutTotalReparation;
    }

    const moyenne = sommeTotale / reparations.length;

    res.status(200).json({ depenseMoyenne: moyenne });
  } catch (error) {
    console.error("Erreur lors du calcul de la dépense moyenne :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur, veuillez réessayer plus tard" });
  }
};

const getChiffreParMois = async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    if (isNaN(year)) {
      return res.status(400).json({ message: "L'année fournie est invalide." });
    }

    const result = await Reparation.aggregate([
      {
        $match: {
          $expr: { $gt: ["$date_fin", "$date_debut"] },
          date_debut: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $lookup: {
          from: "detailreparations", // Jointure avec DetailReparations
          localField: "detail_reparation_id",
          foreignField: "_id",
          as: "detail_reparation_info",
        },
      },
      {
        $addFields: {
          month: { $month: "$date_debut" }, // Extraire le mois de la date de début
          totalDetailsPrice: {
            $sum: "$detail_reparation_info.prix_total", // Calculer la somme des prix des détails de réparation
          },
        },
      },
      {
        $group: {
          _id: "$month", // Regrouper par mois
          totalRevenue: {
            $sum: {
              $add: ["$prix_main_doeuvre", "$totalDetailsPrice"], // Calculer le total pour chaque réparation (main-d'œuvre + détails)
            },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Trier par mois
      },
    ]);

    // Compléter les mois sans chiffre d'affaires avec une valeur de 0
    const revenuePerMonth = [];
    for (let i = 1; i <= 12; i++) {
      const monthData = result.find((item) => item._id === i);
      revenuePerMonth.push({
        month: i,
        revenue: monthData ? monthData.totalRevenue : 0,
      });
    }

    // Retourner les résultats dans la réponse
    return res.json({
      year,
      revenuePerMonth,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message: "Une erreur est survenue lors du calcul du chiffre d'affaires.",
        error: err.message,
      });
  }
};

module.exports = {
  getUserCounts,
  getRepairsCountByMonth,
  getTopSellingPiece,
  getTopClients,
  getAverageRepairTime,
  depenseMoyenneParReparation,
  getChiffreParMois
};

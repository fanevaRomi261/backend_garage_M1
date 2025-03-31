const RendezVous = require("../models/RendezVous");
const planningController = require("../controllers/planningController");
const Utilisateur = require("../models/Utilisateur");

const getRendezVousMecanicien = async (idMecanicien) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // Si dimanche (0), on ajuste à -6, sinon à 1
  firstDayOfWeek.setDate(today.getDate() + diffToMonday);
  firstDayOfWeek.setHours(0, 0, 0, 0);

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 5);
  lastDayOfWeek.setHours(12, 59, 59, 999);

  const listeRendezVous = await RendezVous.find({
    mecanicien_id: idMecanicien,
    // date_rdv: { $gte: firstDayOfWeek, $lte: lastDayOfWeek }, // Plage de dates entre lundi et vendredi
    etat: {$gte : 5},
  })
    .select("_id client_id heure_rdv date_rdv id_voiture etat")
    .lean()
    .populate({
      path: "client_id",
      select: "_id nom prenom mail contact profil_id",
    })
    .populate("service_id")
    .populate({
      path: "id_voiture",
      select: "_id immatriculation modele marque",
    });

  return listeRendezVous;
};

const getRendezVousManager = async () => {
  const listeRendezVous = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // Si dimanche (0), on ajuste à -6, sinon à 1
  firstDayOfWeek.setDate(today.getDate() + diffToMonday);
  firstDayOfWeek.setHours(0, 0, 0, 0);

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 5);
  lastDayOfWeek.setHours(12, 59, 59, 999);

  const allUtilisateur = await Utilisateur.find()
    .select("_id nom prenom profil_id")
    .populate({
      path: "profil_id",
      select: "_id libelle",
    });
  const mecaniciens = allUtilisateur.filter(
    (meca) => meca.profil_id.libelle === "Mécanicien"
  );

  for (const meca of mecaniciens) {
    
    const rendezVousForMeca = await RendezVous.find({
      mecanicien_id: meca._id,
    //   date_rdv: { $gte: firstDayOfWeek, $lte: lastDayOfWeek },
      etat: {$gte : 5},
    })
      .select("_id client_id heure_rdv date_rdv etat service_id id_voiture")
      .lean()
      .populate({
        path: "client_id",
        select: "_id nom prenom contact",
      })
      .populate({
        path: "service_id",
        select: "_id libelle duree",
      })
      .populate({
        path: "id_voiture",
        select: "_id immatriculation modele marque",
      });

      const rdv = {
        mecanicien: meca,
        rendez_vous_semaine: rendezVousForMeca,
      };

    listeRendezVous.push(rdv);
  }

  return listeRendezVous;
};

module.exports = {
    getRendezVousMecanicien,
    getRendezVousManager
};
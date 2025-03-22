const express = require("express");
const Utilisateur = require("../models/Utilisateur");
const Profil = require("../models/Profil");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

exports.getListeMecanicien = async (req, res) => {
  try {
    const profilLibelle = "mécanicien";

    const profil = await Profil.findOne({ libelle: { $regex: profilLibelle, $options: "i" } });
    if (!profil) {
      return res.status(400).json({ message: "Profil 'mécanicien' non trouvé" });
    }

    const mecaniciens = await Utilisateur.find({ profil_id: new mongoose.Types.ObjectId(profil._id) }).select("-pwd");

    res.json(mecaniciens);
  } catch (err) {
    console.log(err);
    res.status(500).send('Erreur selection mecanicien');
  }
}

exports.ajoutMecanicien = async (req, res) => {
  const { nom, prenom, mail, dtn,contact } = req.body;

  try {
    const existingUser = await Utilisateur.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const defaultPwd = process.env.DEFAULT_PASSWORD;
    const saltRounds = 10;
    const hashedPwd = await bcrypt.hash(defaultPwd, saltRounds);

    const profilLibelle = "mécanicien";
    const profil = await Profil.findOne({ libelle: { $regex: profilLibelle, $options: "i" } });
    if (!profil) {
      return res.status(400).json({ message: "Profil 'Mecanicien' non trouvé" });
    }

    // console.log(profil._id);

    const newUser = new Utilisateur({
      nom,
      prenom,
      mail,
      pwd: hashedPwd,
      dtn,
      contact,
      profil_id : profil._id,
    });

    await newUser.save();

    res.status(201).json({ message: "Ajout mecanicien réussie !" });
  } catch (error) {
    console.error("Erreur lors de l'ajout mecanicien :", error.message);
    res.status(500).json({ message: error });
  }
};

exports.desactiverUtilisateur = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.isActif = 0;
    await user.save();

    res.status(200).json({ message: 'Utilisateur désactivé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

exports.activerUtilisateur = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.isActif = 1;
    await user.save();

    res.status(200).json({ message: 'Utilisateur activé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};


exports.modifierMecanicien = async (req, res) => {
  try {
    const { userId } = req.params;
    const { nom, prenom, mail, contact, dtn,isActif } = req.body;

    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur sauf lui
    const existingUser = await Utilisateur.findOne({ mail, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    user.nom = nom;
    user.prenom = prenom;
    user.mail = mail;
    user.contact = contact;
    user.dtn = dtn;
    user.isActif = isActif;

    await user.save();

    res.status(200).json({ message: 'Mécanicien modifié avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la modification' });
  }
};

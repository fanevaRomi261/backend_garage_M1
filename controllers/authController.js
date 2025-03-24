const express = require("express");
const Utilisateur = require("../models/Utilisateur");
const Profil = require("../models/Profil");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// login
exports.login = async (req, res) => {
  const { mail, pwd } = req.body;

  try {
    const user = await Utilisateur.findOne({ mail });

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }


    if (user.isActif === 0) {
      return res.status(400).json({ message: "Votre compte est désactivé" });
    }

    const mustChangePassword = pwd === process.env.DEFAULT_PASSWORD;
    const token = jwt.sign(
      { userId: user._id, userProfilId: user.profil_id._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "5h",
      }
    );

    if (mustChangePassword) {
      return res.status(200).json({
        message: "Veuillez changer votre mot de passe",
        userId: user._id,
        token,
        mustChangePassword: true,
      });
    }

    res.json({
      message: "Connexion réussie",
      userId: user._id,
      token,
      mustChangePassword: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Inscription
exports.register = async (req, res) => {
  const { nom, prenom, mail, pwd, dtn, contact } = req.body;

  try {
    const existingUser = await Utilisateur.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const saltRounds = 10;
    const hashedPwd = await bcrypt.hash(pwd, saltRounds);

    const profil = await Profil.findOne({ libelle: { $regex: /^client$/i } });
    if (!profil) {
      return res.status(400).json({ message: "Profil 'Client' non trouvé" });
    }

    // console.log(profil._id);

    const newUser = new Utilisateur({
      nom,
      prenom,
      mail,
      pwd: hashedPwd,
      dtn,
      contact,
      profil_id: profil._id,
    });

    await newUser.save();

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.changePassword = async (req, res) => {
  const userId  = req.user.userId;
  const { oldPwd, newPwd } = req.body;

  // console.log(req.user.userId);

  try {
    const user = await Utilisateur.findById(userId);

    // console.log(user);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(oldPwd, user.pwd);
    if (!isMatch) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });
    }

    if (oldPwd === newPwd) {
      return res.status(400).json({ message: "Le nouveau mot de passe doit être différent" });
    }

    const saltRounds = 10;
    const hashedNewPwd = await bcrypt.hash(newPwd, saltRounds);

    user.pwd = hashedNewPwd;
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès !" });
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


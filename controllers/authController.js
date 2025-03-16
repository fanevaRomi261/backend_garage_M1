const express = require("express");
const router = express.Router();
const Utilisateur = require("../models/Utilisateur");
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      message: "Connexion réussie",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Inscription
exports.register = async (req, res) => {
  const { nom, prenom, mail, pwd, dtn, profil_id } = req.body;

  try {
    const existingUser = await Utilisateur.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const saltRounds = 10;
    const hashedPwd = await bcrypt.hash(pwd, saltRounds);

    const newUser = new Utilisateur({
      nom,
      prenom,
      mail,
      pwd: hashedPwd,
      dtn,
      profil_id,
    });

    await newUser.save();

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

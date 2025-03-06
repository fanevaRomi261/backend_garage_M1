const mongoose = require("mongoose");

const UtilisateurSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    mail: { type: String, required: true },
    pwd: { type: String, required: true },
    dtn: { type: Date, required: true },
    profil_id: { type: mongoose.Schema.Types.ObjectId, ref: "Profil", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("utilisateurs", UtilisateurSchema);

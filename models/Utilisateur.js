const mongoose = require("mongoose");

const UtilisateurSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    mail: { type: String, required: true },
    pwd: { type: String, required: true },
    dtn: { type: Date, required: true },
    contact: { type: String, required: true },
    profil_id: { type: mongoose.Schema.Types.ObjectId, ref: "Profils", required: true },
    isActif: { type: Number,default: 1,enum: [0, 1] },
    // vehicules_id : [{ type : mongoose.Schema.Types.ObjectId , ref: 'Vehicules' }]
  },
  { timestamps: true }
);


module.exports = mongoose.model("Utilisateurs", UtilisateurSchema);

const mongoose = require("mongoose");

const ProfilSchema = new mongoose.Schema(
  {
    libelle: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profils", ProfilSchema);

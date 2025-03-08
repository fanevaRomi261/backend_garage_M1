const mongoose = require("mongoose");

const TypeVehiculeSchema = new mongoose.Schema(
  {
    libelle: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TypeVehicules", TypeVehiculeSchema);

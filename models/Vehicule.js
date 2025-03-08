const mongoose = require("mongoose");

const VehiculeSchema = new mongoose.Schema(
  {
    immatriculation: { type: String, required: true },
    modele: { type: String, required: true },
    marque: { type: String, required: true },
    type_vehicule_id: { type: mongoose.Schema.Types.ObjectId, ref: "TypeVehicules", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicules", VehiculeSchema);

const mongoose = require("mongoose");

const ReparationSchema = new mongoose.Schema(
  {
    rendez_vous_id : { type: mongoose.Schema.Types.ObjectId , ref: 'RendezVous', required: true },
    date_debut : { type : Date , required: true },
    date_fin : { type : Date , required: true },
    observation : { type : String },
    prix_main_doeuvre : { type : Number , required :  true },
    detail_reparation_id : [{ type: mongoose.Schema.Types.ObjectId , ref: 'DetailReparations', required: true }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reparations", ReparationSchema);

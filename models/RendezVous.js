const mongoose = require("mongoose");
const Time = require("../shared/Time");
const Etat = require("../shared/Etat");

const RendezVousSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateurs",
      required: true,
    },
    mecanicien_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateurs",
      required: true,
    },
    heure_rdv: { type: Time.schema, required: true },
    date_rdv: { type: Date, required: true },
    etat: { type: Number, required: true },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
      required: true,
    },
    id_voiture : { type: mongoose.Schema.Types.ObjectId , ref:'Vehicules' , required: true }
  },
  { timestamps: true }
);



module.exports = mongoose.model("RendezVous", RendezVousSchema);

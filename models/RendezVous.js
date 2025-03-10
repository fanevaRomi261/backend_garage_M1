const mongoose = require("mongoose");

const RendezVousSchema = new mongoose.Schema(
  {
    client_id : { type: mongoose.Schema.Types.ObjectId , ref: 'Utilisateurs', required: true },
    mecanicien_id : { type: mongoose.Schema.Types.ObjectId , ref: 'Utilisateurs', required: true },
    duree : { type: Time.schema , required: true },
    date_rdv : { type : Date , required: true },
    etat : { type : Number , required: true },
    service_id : { type: mongoose.Schema.Types.ObjectId , ref:'Services' , required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RendezVous", RendezVousSchema);

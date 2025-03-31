const mongoose = require("mongoose");

const EtatSchema = new mongoose.Schema(
  {
    id_etat : {type : Number , required : true},
    libelle : { type: String , required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Etats", EtatSchema);

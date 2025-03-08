const mongoose = require("mongoose");

const PieceSchema = new mongoose.Schema(
  {
    libelle : { type: String , required: true },
    type_vehicule_id : [{ type : mongoose.Schema.Types.ObjectId , ref: 'TypeVehicules' , required: true }],
    prix : { type : Number , required :  true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pieces", PieceSchema);

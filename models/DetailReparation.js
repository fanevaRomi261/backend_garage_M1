const mongoose = require("mongoose");

const DetailReparationSchema = new mongoose.Schema(
  {
    piece_id : { type: mongoose.Schema.Types.ObjectId , ref: 'Pieces', required: true },
    quantite : { type : Number , required: true },
    prix_total : { type : Number , required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DetailReparations", DetailReparationSchema);

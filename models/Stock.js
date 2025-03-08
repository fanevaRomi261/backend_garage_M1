const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    piece_id : { type : mongoose.Schema.Types.ObjectId , ref: 'Pieces' , required: true },
    date_entree : { type : Date , required :  true },
    quantite : { type : Number , required : true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stocks", StockSchema);

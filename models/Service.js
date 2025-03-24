const mongoose = require("mongoose");
const timeSchema = require("../shared/Time").schema;

const ServiceSchema = new mongoose.Schema(
  {
    libelle : { type: String, required: true },
    duree : { type: timeSchema , required: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Services", ServiceSchema);

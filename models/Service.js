const mongoose = require("mongoose");
const Time = require('../shared/Time');

const ServiceSchema = new mongoose.Schema(
  {
    libelle : { type: String, required: true },
    duree : { type: Time.schema , required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Services", ServiceSchema);

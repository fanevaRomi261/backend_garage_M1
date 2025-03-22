const RendezVous = require("../models/RendezVous");
const Reparation = require("../models/Reparation");

const getReparationsByVehiculeId = async (req, res) => {
  try {
    const { idvehicule } = req.params;

    const rendezvous = await RendezVous.find({ id_voiture: idvehicule });

    if (!rendezvous.length) {
      return res.status(200).json([]);
    }

    const reparations = await Reparation.find({
      rendez_vous_id: { $in: rendezvous.map((rdv) => rdv._id) },
    }).populate({
      path: "detail_reparation_id",
      populate: {
        path: "piece_id",
        model: "Pieces",
      },
    });

    res.status(200).json(reparations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = {
  getReparationsByVehiculeId,
};

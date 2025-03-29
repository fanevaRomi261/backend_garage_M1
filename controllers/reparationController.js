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



const insertReparation = async(req,res) => {
  try{
    const {rendez_vous_id,date_debut} = req.body;

    const newReparation = new Reparation({
      rendez_vous_id,
      date_debut
    });

    await newReparation.save();

    await RendezVous.findByIdAndUpdate(
      rendez_vous_id, 
      {etat : 15}, 
      {new : true}, 
      {runValidators : true});
      
      res.status(201).json({message : "Reparation ajouté"})

  }catch(error){
    res.status(400).json({message: "Erreur lors de l'ajout de reparation " + error.message});
  }
}







module.exports = {
  getReparationsByVehiculeId,
};

const RendezVous = require("../models/RendezVous");
const Reparation = require("../models/Reparation");
const reparationService = require("../services/reparationService");

exports.getReparationsByVehiculeId = async (req, res) => {
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


exports.commencerReparation = async (req, res) => {
  try {

    const { mecanicien_id , rendez_vous_id, date_debut , date_fin , prix_main_doeuvre } = req.body;

    if(await reparationService.verifierReparationPrecedente(mecanicien_id,rendez_vous_id) === true){
      throw new Error("Veuillez clôturer la réparation précédente");
    }

    const newReparation = new Reparation({
      rendez_vous_id,
      date_debut,
      date_fin,
      prix_main_doeuvre,
    });

    await newReparation.save(); 

    const filter = { _id: rendez_vous_id };
    const fieldUpdate = { etat: 15 };

    const rendezvous = await RendezVous.findByIdAndUpdate(filter, fieldUpdate); 
    rendezvous.save();

    res.status(201).json(newReparation);
    
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


exports.closeReparation = async(req,res) => {
  try{
    const {reparation_id , rendez_vous_id , date_fin , prix_main_doeuvre ,  observation } = req.body;

    const filterReparation = {
      _id : reparation_id
    }
    const fieldUpdate = {
      date_fin : date_fin,
      observation : observation,
      prix_main_doeuvre : prix_main_doeuvre
    }
    const reparation = await Reparation.findByIdAndUpdate(filterReparation,fieldUpdate);
    reparation.save();

    const filter = { _id: rendez_vous_id };
    const rdvUpdate = { etat: 20 };

    const rendezvous = await RendezVous.findByIdAndUpdate(filter,rdvUpdate);
    rendezvous.save();
    
    res.status(201).json({ message: 'Réparation fermée'});

  }catch(error){
    res.status(400).json({
      message: "Erreur lors de la fermeture de réparation : " + error.message,
    }); 
  }
}

exports.findReparationById = async(req,res) =>{
  try{
    const {id_reparation} = req.params;

    const reparation = await Reparation.findOne({_id:id_reparation}).populate("detail_reparation_id");
    res.json(reparation);
  }catch(error){
    res.status(500).json({
      message: "Réparation non trouvée : " + error.message,
    });
  }
}

exports.payerReparation = async(req,res) => {
  try{
    const {rendez_vous_id} = req.body;

    const rendezvous = await RendezVous.findByIdAndUpdate({_id: rendez_vous_id},{etat : 25});
    rendezvous.save();

    res.status(201).json({message: 'Réparation payé'});

  }catch(error){
    res.status(400).json({
      message: "Erreur lors du paiement de réparation : " + error.message,
    })
  } 
}


const Vehicule = require("../models/Vehicule");
const Utilisateur = require("../models/Utilisateur");
const TypeVehicule = require("../models/TypeVehicule");

// dans le cas hoe le utilisateur connecte ihany no mi ajouter ny vaikany fa tsy le manager
exports.ajouterVehicule = async (req, res) => {
  try {
    // console.log("yes");
    const utilisateur_id = req.user.userId;

    let { immatriculation, modele, marque, type_vehicule_id } = req.body;

    const type_v = await TypeVehicule.findById(type_vehicule_id);
    console.log(type_vehicule_id);
    if (!type_v) {
      return res.status(404).json({ message: "Type vehicules non trouvé" });
    }

    const utilisateur = await Utilisateur.findById(utilisateur_id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const vehicule = new Vehicule({
      immatriculation,
      modele,
      marque,
      type_vehicule_id: type_v._id,
      utilisateur_id,
    });

    await vehicule.save();
    res.status(201).json({ message: "Véhicule ajouté avec succès", vehicule });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getVehiculesParUtilisateur = async (req, res) => {
  try {
    const utilisateur_id = req.params.id;

    const utilisateur = await Utilisateur.findById(utilisateur_id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const vehicules = await Vehicule.find({ utilisateur_id });

    res.json(vehicules);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// update vehicule par l'user connecte

exports.updateVehicule = async (req, res) => {
  try {
    const vehicule_id = req.params.id;
    const utilisateur_id = req.user.userId;

    const { immatriculation, modele, marque, type_vehicule_id } = req.body;

    // Vérifier si le véhicule existe et appartient à l'utilisateur connecté
    const vehicule = await Vehicule.findOne({
      _id: vehicule_id,
      utilisateur_id,
    });
    if (!vehicule) {
      return res
        .status(404)
        .json({
          message:
            "Véhicule non trouvé ou vous n'avez pas la permission de le modifier",
        });
    }

    // Vérifier si le type de véhicule existe
    if (type_vehicule_id) {
      const type_v = await TypeVehicule.findById(type_vehicule_id);
      if (!type_v) {
        return res.status(404).json({ message: "Type de véhicule non trouvé" });
      }
      vehicule.type_vehicule_id = type_v._id;
    }

    // Mettre à jour uniquement les champs fournis dans la requête
    if (immatriculation !== undefined) vehicule.immatriculation = immatriculation;
    if (modele !== undefined) vehicule.modele = modele;
    if (marque !== undefined) vehicule.marque = marque;

    await vehicule.save();

    res
      .status(200)
      .json({ message: "Véhicule mis à jour avec succès", vehicule });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

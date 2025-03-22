const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


exports.validateAjoutVehicule = [
  body("immatriculation").notEmpty().withMessage("L'immatriculation est requise."),
  body("modele").notEmpty().withMessage("Le modèle est requis."),
  body("marque").notEmpty().withMessage("La marque est requise."),
  body("type_vehicule_id")
    .notEmpty().withMessage("Le type de véhicule est requis.")
    .isMongoId().withMessage("L'ID du type de véhicule est invalide."),
  handleValidationErrors,
];

exports.validateUpdateVehicule = [
  param("id").isMongoId().withMessage("L'ID du véhicule est invalide."),
  body("immatriculation").optional().notEmpty().withMessage("L'immatriculation ne peut pas être vide."),
  body("modele").optional().notEmpty().withMessage("Le modèle ne peut pas être vide."),
  body("marque").optional().notEmpty().withMessage("La marque ne peut pas être vide."),
  body("type_vehicule_id").optional().isMongoId().withMessage("L'ID du type de véhicule est invalide."),
  handleValidationErrors,
];

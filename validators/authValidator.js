const { check, validationResult } = require("express-validator");

exports.validateRegister = [
  check("nom").notEmpty().withMessage("Le nom est requis."),
  check("prenom").notEmpty().withMessage("Le prénom est requis."),
  check("mail")
    .isEmail()
    .withMessage("Email invalide.")
    .normalizeEmail(),
  check("pwd")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères."),
    // .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
    // .withMessage("Doit contenir au moins une majuscule, un chiffre et un caractère spécial."),
  check("contact")
    .isMobilePhone("fr-FR")
    .withMessage("Numéro de téléphone invalide."),
  check("dtn")
    .isISO8601()
    .withMessage("Date de naissance invalide (format attendu: YYYY-MM-DD)."),
  
  // Middleware pour renvoyer les erreurs
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

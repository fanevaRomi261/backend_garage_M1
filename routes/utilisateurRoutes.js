const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateurController");
const { verifToken, verifProfil } = require('../middlewares/authMiddleware');

router.get("/mecanicien", verifToken,verifProfil(['Manager']),utilisateurController.getListeMecanicien);
router.post("/mecanicien", verifToken,verifProfil(['Manager']),utilisateurController.ajoutMecanicien);

router.put("/mecanicien/:userId", verifToken,verifProfil(['Manager']),utilisateurController.modifierMecanicien);
router.put("/desactiver/:userId", verifToken,verifProfil(['Manager']),utilisateurController.desactiverUtilisateur);
router.put("/activer/:userId", verifToken,verifProfil(['Manager']),utilisateurController.activerUtilisateur);

router.get("/:id", verifToken,utilisateurController.getInfoUser);

module.exports = router;

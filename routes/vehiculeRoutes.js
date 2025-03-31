const express = require("express");
const router = express.Router();
const vehiculeController = require("../controllers/vehiculeController");
const { verifToken, verifProfil } = require('../middlewares/authMiddleware');
const { validateAjoutVehicule, validateUpdateVehicule } = require("../validators/vehiculeValidator");

router.get("/:id", verifToken,vehiculeController.getVehiculeById);

router.post("/", verifToken,verifProfil(["Client"]),validateAjoutVehicule,vehiculeController.ajouterVehicule);

// verifier si connecté slm car tous les profils pourront voir la liste des vehicules d'une personne donnée
router.get("/utilisateur/:id", verifToken,vehiculeController.getVehiculesParUtilisateur);

router.put("/:id", verifToken,verifProfil(["Client"]),validateAjoutVehicule,vehiculeController.updateVehicule);

module.exports = router;

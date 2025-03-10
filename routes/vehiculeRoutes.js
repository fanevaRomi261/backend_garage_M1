const express = require("express");
const router = express.Router();
const vehiculeController = require("../controllers/vehiculeController");
const { verifToken, verifProfil } = require('../middlewares/authMiddleware');

router.post("/", verifToken,verifProfil(["Client"]),vehiculeController.ajouterVehicule);

// verifier si connecté slm car tous les profils pourront voir la liste des vehicules d'une personne donnée
router.get("/utilisateur/:id", verifToken,vehiculeController.getVehiculesParUtilisateur);

router.put("/utilisateur/:id", verifToken,verifProfil(["Client"]),vehiculeController.updateVehicule);

module.exports = router;

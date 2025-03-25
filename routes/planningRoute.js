const express = require("express");
const router = express.Router();
const planningController = require("../controllers/planningController");
const rendezvousController = require("../controllers/rendezVousController");
const { verifToken } = require("../middlewares/authMiddleware");

// getAllMeca
router.get("/mecanicien" , planningController.getAllMecanicien);

router.get("/rendezvous", rendezvousController.getAllRendezVous);

router.get("/rendezvousdate" , planningController.getRendezVousFromDate);

router.get("/test" , planningController.getTempsLibreMecanicien);

router.post("/proposeCreneau" , planningController.getCreneauPossibleJournee);

module.exports = router;
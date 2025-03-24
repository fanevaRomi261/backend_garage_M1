const express = require("express");
const router = express.Router();
const planningController = require("../controllers/planningController");
const { verifToken } = require("../middlewares/authMiddleware");

// getAllMeca
router.get("/mecanicien" , planningController.getAllMecanicien);

router.get("/rendezvous", planningController.getAllRendezVous);

router.get("/rendezvousdate" , planningController.getRendezVousFromDate);

router.get("/test" , planningController.getTempsLibreMecanicien);

router.post("/proposeCreneau" , planningController.getCreneauPossibleJournee);



module.exports = router;
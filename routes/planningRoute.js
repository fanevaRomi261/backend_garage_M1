const express = require("express");
const router = express.Router();
const planningController = require("../controllers/planningController");
const rendezvousController = require("../controllers/rendezVousController");
const { verifToken } = require("../middlewares/authMiddleware");

// getAllMeca
router.get("/mecanicien",verifToken,planningController.getAllMecanicien);

router.get("/rendezvous",verifToken,rendezvousController.getAllRendezVous);

router.get("/rendezvousdate",verifToken,planningController.getRendezVousFromDate);

router.get("/test",verifToken,planningController.getTempsLibreMecanicien);

router.post("/proposeCreneau",verifToken,planningController.getCreneauPossibleJournee);

router.post("/mecanicien/libre",verifToken,planningController.proposeChangementMecanicien);


module.exports = router;
const express = require("express");
const router = express.Router();
const reparationController = require('../controllers/reparationController');
const { verifToken } = require('../middlewares/authMiddleware');


// liste reparation d'un vehicule
router.get("/vehicule/:idvehicule",verifToken,reparationController.getReparationsByVehiculeId);

router.get("/find/:id_reparation" , reparationController.findReparationById);

router.post("/commencer", reparationController.commencerReparation);

router.post("/terminer" , reparationController.closeReparation);

router.post("/payer" , reparationController.payerReparation);

module.exports = router;

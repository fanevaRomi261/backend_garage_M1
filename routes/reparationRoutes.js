const express = require("express");
const router = express.Router();
const reparationController = require('../controllers/reparationController');
const { verifToken } = require('../middlewares/authMiddleware');


// liste reparation d'un vehicule
router.get("/vehicule/:idvehicule",verifToken,reparationController.getReparationsByVehiculeId);

router.get("/find/:id_reparation",verifToken,reparationController.findReparationById);

router.post("/commencer",verifToken, reparationController.commencerReparation);

router.post("/terminer",verifToken, reparationController.closeReparation);

router.post("/payer",verifToken, reparationController.payerReparation);

module.exports = router;

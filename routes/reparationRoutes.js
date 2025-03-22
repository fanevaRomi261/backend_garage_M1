const express = require("express");
const router = express.Router();
const raparationController = require('../controllers/reparationController');
const { verifToken } = require('../middlewares/authMiddleware');


// liste reparation d'un vehicule
router.get("/vehicule/:idvehicule",verifToken,raparationController.getReparationsByVehiculeId);

module.exports = router;

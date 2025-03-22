const express = require("express");
const router = express.Router();
const typeVehiculeController = require('../controllers/typeVehiculeController');
const { verifToken } = require('../middlewares/authMiddleware');

// all profil
router.get("/",verifToken,typeVehiculeController.getTypeVehicule);

module.exports = router;

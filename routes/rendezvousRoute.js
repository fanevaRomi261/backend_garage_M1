const express = require("express");
const router = express.Router();
const planningController = require('../controllers/planningController');

router.post("/save",planningController.addRendezVous);

router.get("/mecanicien" , planningController.getAllMecanicien);

router.get("/")


module.exports = router;

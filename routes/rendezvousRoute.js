const express = require("express");
const router = express.Router();
const planningController = require('../controllers/planningController');

router.post("/save",planningController.addRendezVous);

module.exports = router;

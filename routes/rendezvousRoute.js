const express = require("express");
const router = express.Router();
const planningController = require('../controllers/planningController');
const rendezvousController = require('../controllers/rendezVousController');

router.post("/save",planningController.addRendezVous);

router.get("/mecanicien" , planningController.getAllMecanicien);

router.get("/futur/:idClient" , rendezvousController.getFuturRendezVousClient);

router.get("/mecanicien/:idMecanicien" , rendezvousController.getRendezVousSemaineMecanicien);

router.get("/manager" , rendezvousController.getRendezVousSemaineManager );

router.get("/")


module.exports = router;

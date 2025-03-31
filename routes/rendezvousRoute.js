const express = require("express");
const router = express.Router();
const planningController = require('../controllers/planningController');
const rendezvousController = require('../controllers/rendezVousController');

router.post("/save",planningController.addRendezVous);

router.post("/find" , rendezvousController.getRendezVousById);

router.get("/futur/:idClient" , rendezvousController.getFuturRendezVousClient);

// router.get("/mecanicien/:idMecanicien" , rendezvousController.getRendezVousSemaineMecanicien);

router.get("/employe/:idEmploye" , rendezvousController.getRendezVousEmploye);

router.put("/update", rendezvousController.updateRendezVous);

router.put("/annuler/:id_rendezvous" , rendezvousController.annulerRendezVous);

router.get("/")


module.exports = router;

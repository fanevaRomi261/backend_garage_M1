const express = require("express");
const router = express.Router();
const planningController = require('../controllers/planningController');
const rendezvousController = require('../controllers/rendezVousController');
const { verifToken,verifProfil } = require('../middlewares/authMiddleware');

router.post("/save",verifToken,planningController.addRendezVous);

router.post("/find",verifToken, rendezvousController.getRendezVousById);

router.get("/futur/:idClient",verifToken,rendezvousController.getFuturRendezVousClient);

// router.get("/mecanicien/:idMecanicien" , rendezvousController.getRendezVousSemaineMecanicien);

router.get("/employe/:idEmploye",verifToken,rendezvousController.getRendezVousEmploye);

router.put("/update",verifToken,rendezvousController.updateRendezVous);

router.put("/annuler/:id_rendezvous",verifToken,rendezvousController.annulerRendezVous);


router.get("/mes-rdv/:idClient" , verifToken,rendezvousController.getRendezVousClient);

router.get("/reparation/:id_rendezvous",verifToken ,rendezvousController.findReparationForRendezVous);


router.get("/")


module.exports = router;

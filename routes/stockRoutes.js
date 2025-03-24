const express = require("express");
const router = express.Router();
const stockController = require('../controllers/stockController');
const { verifToken, verifProfil } = require('../middlewares/authMiddleware');


router.post("/entree",verifToken,verifProfil(['Manager']),stockController.ajouterEntreeStock);

router.post("/sortie",verifToken,verifProfil(['Mecanicien','Manager']),stockController.ajouterDetailReparation);

router.get("/etat",verifToken,verifProfil(['Manager']),stockController.getStock);


module.exports = router;

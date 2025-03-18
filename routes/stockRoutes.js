const express = require("express");
const router = express.Router();
const stockController = require('../controllers/stockController');
const { verifToken, verifProfil } = require('../middlewares/authMiddleware');


router.post("/entree",verifToken,stockController.ajouterEntreeStock);

router.post("/sortie",verifToken,stockController.ajouterDetailReparation);

router.get("/etat",verifToken,stockController.getStock);


module.exports = router;

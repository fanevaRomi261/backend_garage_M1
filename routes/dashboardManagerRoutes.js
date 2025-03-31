const express = require("express");
const router = express.Router();
const dashboardManagerController = require('../controllers/dashboardManagerController');
const { verifToken,verifProfil } = require('../middlewares/authMiddleware');

router.get("/user-count",verifToken,verifProfil(["Manager"]),dashboardManagerController.getUserCounts);

router.get("/reparation-count/:year",verifToken,verifProfil(["Manager"]),dashboardManagerController.getRepairsCountByMonth);

router.get("/piece-plus-vendu",verifToken,verifProfil(["Manager"]),dashboardManagerController.getTopSellingPiece);

router.get("/client-fidele",verifToken,verifProfil(["Manager"]),dashboardManagerController.getTopClients);

router.get("/temps-moyen-reparation",verifToken,verifProfil(["Manager"]),dashboardManagerController.getAverageRepairTime);

router.get("/depense-moyenne-reparation",verifToken,verifProfil(["Manager"]),dashboardManagerController.depenseMoyenneParReparation);

router.get("/chiffre-affaire/:year",verifToken,verifProfil(["Manager"]),dashboardManagerController.getChiffreParMois);


module.exports = router;

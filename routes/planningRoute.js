const express = require("express");
const router = express.Router();
const planningController = require("../controllers/planningController");
const { verifToken } = require("../middlewares/authMiddleware");

// getAllMeca
router.get("/mecanicien" , planningController.getAllMecanicien);

module.exports = router;
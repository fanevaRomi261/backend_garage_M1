const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

router.get("", serviceController.getAllService);

router.get("/find/:idService" , serviceController.findServiceById);

module.exports = router;
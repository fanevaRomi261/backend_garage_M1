const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { verifToken } = require('../middlewares/authMiddleware');

router.get("",verifToken,serviceController.getAllService);

router.get("/find/:idService",verifToken,serviceController.findServiceById);

module.exports = router;
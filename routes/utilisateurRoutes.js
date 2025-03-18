const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateurController");
const { verifToken, verifProfil } = require('../middlewares/authMiddleware');

router.get("/:id", verifToken,utilisateurController.getInfoUser);

module.exports = router;

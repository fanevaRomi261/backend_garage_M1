const express = require("express");
const router = express.Router();
const profilController = require('../controllers/profilController');

// all profil
router.get("/",profilController.getProfils);

module.exports = router;

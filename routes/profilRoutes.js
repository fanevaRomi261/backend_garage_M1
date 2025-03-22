const express = require("express");
const router = express.Router();
const profilController = require('../controllers/profilController');
const { verifToken } = require('../middlewares/authMiddleware');

// all profil
router.get("/",verifToken,profilController.getProfils);

module.exports = router;

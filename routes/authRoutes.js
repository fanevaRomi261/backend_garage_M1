const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister } = require("../validators/authValidator");

// login
router.post("/login",authController.login);

// Inscription
router.post("/register",validateRegister,authController.register);

module.exports = router;

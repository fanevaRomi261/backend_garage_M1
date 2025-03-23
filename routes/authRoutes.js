const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister } = require("../validators/authValidator");
const { verifToken } = require('../middlewares/authMiddleware');

// login
router.post("/login",authController.login);

// Inscription
router.post("/register",validateRegister,authController.register);

// Inscription
router.put("/change-pwd",verifToken,authController.changePassword);


module.exports = router;
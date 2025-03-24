const express = require("express");
const router = express.Router();
const pieceController = require('../controllers/pieceController');
const { verifToken } = require('../middlewares/authMiddleware');

// all piece
router.get("/",verifToken,pieceController.getPiece);

module.exports = router;

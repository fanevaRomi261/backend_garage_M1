const express = require("express");
const router = express.Router();
const pieceController = require('../controllers/pieceController');
const { verifToken,verifProfil } = require('../middlewares/authMiddleware');

// all piece
router.get("/",verifToken,pieceController.getPiece);
router.post("/",verifToken,verifProfil(["Manager"]),pieceController.ajoutPiece);
router.put("/:id",verifToken,verifProfil(["Manager"]),pieceController.modifierPiece);

module.exports = router;

const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaksiController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Ringkasan transaksi (hanya admin)
router.get("/summary", verifyToken, isAdmin, transactionController.getTransactionSummary);

// Daftar transaksi ringkas (hanya admin)
router.get("/list", verifyToken, isAdmin, transactionController.getTransactionList);

module.exports = router;

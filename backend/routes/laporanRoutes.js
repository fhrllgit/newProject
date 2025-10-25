const express = require("express");
const {
  getTotalIncome,
  getSalesPerProduct,
  getOrdersByStatus,
  getDailyIncome,
  getStockReport,
  getFullReport
} = require("../controllers/laporanController");

const router = express.Router();

router.get("/income/total", getTotalIncome);
router.get("/sales/product", getSalesPerProduct);
router.get("/orders/status", getOrdersByStatus);
router.get("/income/daily", getDailyIncome);
router.get("/stock", getStockReport);
router.get("/full", getFullReport);

module.exports = router;

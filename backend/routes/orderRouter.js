const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

// Create order (user)
router.post("/", verifyToken, orderController.createOrder);


// Get all orders (admin)
router.get("/", verifyToken, isAdmin, orderController.getOrders);

// Update order status (admin)
router.put("/:id/status", verifyToken, isAdmin, orderController.updateOrderStatus);


// Get orders user
router.get("/user", verifyToken, orderController.getOrdersUser);
router.get("/history", verifyToken, orderController.getOrderHistoryUser);

module.exports = router;

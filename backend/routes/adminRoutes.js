const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { getAllUsers } = require("../controllers/adminController")

router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
  res.json({ message: `Selamat datang Admin ${req.user.email}` });
});

router.get("/users", verifyToken, isAdmin, getAllUsers);

module.exports = router;

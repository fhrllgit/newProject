const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
  res.json({ message: `Selamat datang Admin ${req.user.email}` });
});

module.exports = router;

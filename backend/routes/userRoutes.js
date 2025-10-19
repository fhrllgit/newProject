const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isUser } = require("../middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", verifyToken, isUser, (req, res) => {
  res.json({ message: `Halo ${req.user.email}, ini profilmu.` });
});

module.exports = router;

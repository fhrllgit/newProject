const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isUser } = require("../middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", verifyToken, isUser, (req, res) => {
  res.json({ message: `${req.user.first_name}` });
});



router.post("/logout", verifyToken, userController.logout);

module.exports = router;

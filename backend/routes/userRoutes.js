const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isUser } = require("../middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", verifyToken, isUser, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({
    user: {
      id: req.user.id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      created_at: req.user.created_at,
      updated_at: req.user.updated_at,
    },
  });
});
router.put("/profile", verifyToken, userController.updateProfile);


router.post("/logout", verifyToken, userController.logout);

module.exports = router;

const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController")
const { verifyToken } = require("../middleware/authMiddleware"); 
router.post("/", verifyToken, addressController.createAddress);

router.get("/:user_id", verifyToken,  addressController.getAddress);

router.put("/:id", verifyToken, addressController.updateAddress);

router.delete("/:id", verifyToken, addressController.deleteAddress);

router.patch("/:user_id/:id/default", verifyToken,  addressController.setDefaultAddress);

module.exports = router;


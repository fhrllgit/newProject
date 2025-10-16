const express = require("express")
const router = express.Router()
const uploadController = require("../controllers/uploadControllers")
const { uploads } = require("../middleware/uploadMiddleware")

router.post("/singleUpload", uploads.single("singleFile"), uploadController.uploadSingleFile)
router.post("/multipleUpload", uploads.array("multipleFile", 10), uploadController.uploadMultipleFile)

module.exports = router

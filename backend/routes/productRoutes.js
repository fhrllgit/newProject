const express = require("express")
const router = express.Router()
const productController = require('../controllers/productController')
const { uploads } = require('../middleware/uploadMiddleware')

router.get('/', productController.getTestApi)
router.get('/product', productController.getAllProducts)
router.get('/product/:id', productController.getAllbyID)
router.get('/filter', productController.getFilteredProducts)
router.post('/post/product', productController.createProduct)
router.put('/put/product/:id', uploads.fields([
    { name: "singleFile", maxCount: 1},
    { name: "multipleFile", maxCount: 10}
]),
productController.updateProduct
)
router.post('/delete-multiple', productController.deleteMultipleProducts)


module.exports = router


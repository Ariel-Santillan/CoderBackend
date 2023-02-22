const { Router } = require('express')
const productsController = require('../controllers/products.controller')
const multerUtils = require('../utils/multer.utils')

const router = Router()

//Mongoose
//All products

router.get('/', productsController.getProducts)

// Product By ID

router.get('/:pid', productsController.getProductById)

//Add product

router.post('/', multerUtils.single('file'), productsController.addProduct)

//Update product

router.put(
  '/:pid',
  multerUtils.single('file'),
  productsController.updateProduct
)

//Delete product by ID

router.delete('/:pid', productsController.deleteProduct)

module.exports = router

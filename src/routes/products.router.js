const { Router } = require('express')
const productsController = require('../controllers/products.controller')
const multerUtils = require('../utils/multer.utils')
const { mdwOnlyAdmin, mdwUserPremium } = require('../config/mdws')

const router = Router()

//Mongoose
//All products

router.get('/', productsController.getProducts)

// Product By ID

router.get('/:pid', productsController.getProductById)

//Update product

router.put(
  '/:pid',
  // multerUtils.single('file'),
  // mdwOnlyAdmin,
  productsController.updateProduct
)
//Add product

router.post(
  '/',
  // multerUtils.single('file'),
  // mdwUserPremium,
  productsController.addProduct
)


//Delete product by ID

router.delete('/:pid', 
// mdwOnlyAdmin, 
productsController.deleteProduct)

module.exports = router

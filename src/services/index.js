const { productsDao, cartsDao } = require('../dao/factory')
const CartService = require('./carts.service')
const ProductService = require('./products.service')

const productService = new ProductService(productsDao)

const cartService = new CartService(cartsDao)

module.exports = {
  productService,
  cartService,
}

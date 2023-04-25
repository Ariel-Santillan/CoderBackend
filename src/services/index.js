const { productsDao, cartsDao, ticketsDao } = require('../dao/factory')
const CartService = require('./carts.service')
const ProductService = require('./products.service')
const TicketService = require('./tickets.service')

const productService = new ProductService(productsDao)

const cartService = new CartService(cartsDao)

const ticketService = new TicketService(ticketsDao)

module.exports = {
  productService,
  cartService,
  ticketService,
}

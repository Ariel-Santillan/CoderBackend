const { productsDao, cartsDao, ticketsDao, userDao } = require('../dao/factory')
const CartService = require('./carts.service')
const ProductService = require('./products.service')
const TicketService = require('./tickets.service')
const UserService = require('./user.service')

const productService = new ProductService(productsDao)

const cartService = new CartService(cartsDao)

const ticketService = new TicketService(ticketsDao)

const userService = new UserService(userDao)

module.exports = {
  productService,
  cartService,
  ticketService,
  userService,
}

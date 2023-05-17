const mongoose = require('mongoose')
const { PERSISTENCE, MONGO_URL } = require('../config/config')

let productsDao = {};
let cartsDao = {};
let ticketsDao = {};
let userDao = {};
(async () => {
  switch (PERSISTENCE) {
    case 'MONGO':
      mongoose.set('strictQuery', false)
      mongoose.connect(MONGO_URL)
      const productsMongoPersistance = await require('./products.dao')
      const cartsMongoPersistance = await require('./carts.dao')
      const ticketsMongoPersistance = await require('./tickets.dao')
      const userMongoPersistance = await require('./user.dao')
      productsDao.get = productsMongoPersistance.get
      productsDao.getById = productsMongoPersistance.getById
      productsDao.getAllProductsByIDs = productsMongoPersistance.getAllProductsByIDs
      productsDao.insert = productsMongoPersistance.insert
      productsDao.update = productsMongoPersistance.updateById
      productsDao.delete = productsMongoPersistance.deleteById
      cartsDao.get = cartsMongoPersistance.get
      cartsDao.getById = cartsMongoPersistance.getById
      cartsDao.insert = cartsMongoPersistance.insert
      cartsDao.updateById = cartsMongoPersistance.updateById
      cartsDao.deleteById = cartsMongoPersistance.deleteById
      ticketsDao.insert = ticketsMongoPersistance.insert
      userDao.getByEmail = userMongoPersistance.getByEmail
      break
    case 'MEMORY':
      const productsMemory = await require('./productsMemory.dao')
      const cartsMemory = await require('./cartsMemory.dao')
      productsDao.get = productsMemory.get
      productsDao.getById = productsMemory.getById
      productsDao.insert = productsMemory.insert
      productsDao.update = productsMemory.updateById
      productsDao.delete = productsMemory.deleteById
      cartsDao.get = cartsMemory.get
      cartsDao.getById = cartsMemory.getById
      cartsDao.insert = cartsMemory.insert
      cartsDao.updateById = cartsMemory.updateById
      cartsDao.deleteById = cartsMemory.deleteById
      break
    default:
      req.fatal('Undefined Persistence')
      break
  }
})()

module.exports = { productsDao, cartsDao, ticketsDao, userDao }
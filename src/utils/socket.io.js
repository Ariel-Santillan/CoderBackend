const socket = require('socket.io')
const ChatsManagerMongo = require('../dao/MongoManager/chatsManagerMongo')
const ProductManagerMongo = require('../dao/MongoManager/productManagerMongo')


let io

const connectSocket = (httpServer) => {
  io = socket(httpServer)

  io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado!')

    const products = await ProductManagerMongo.getProducts()
    const messages = await ChatsManagerMongo.getMessages()
    socket.emit('init-products', { products })
    socket.emit('init-chats', { messages })
  })
}

const emitDeleteProduct = (id) => {
  io.emit('delete-product', id)
}

const emitAddProduct = (product) => {
  io.emit('add-product', product)
}

const emitUpdateProduct = (product) => {
  io.emit('update-product', product)
}

const edmitAddMessage = (message) => {
  io.emit('add-message', message)
}

module.exports = {
  connectSocket,
  emitDeleteProduct,
  emitAddProduct,
  emitUpdateProduct,
  edmitAddMessage,
}

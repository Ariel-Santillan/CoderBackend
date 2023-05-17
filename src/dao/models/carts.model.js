const mongoose = require('mongoose')

const cartsCollection = 'Carts'

const cartsSchema = new mongoose.Schema({
  products: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
        quantity: Number,
        unitValue: Number,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalQuantity: {
    type: Number,
    default: 0,
  },
  users: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
      },
    ],
  },
})

const CartsModel = mongoose.model(cartsCollection, cartsSchema)

module.exports = CartsModel

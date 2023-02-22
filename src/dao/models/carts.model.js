const mongoose = require('mongoose')

const cartsCollection = 'Carts'

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
        },
        quantity: Number,
      },
    ],
    default: [],
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalQuantity: {
    type: Number,
    default: 0,
  },
})

const CartsModel = mongoose.model(cartsCollection, cartsSchema)

module.exports = CartsModel

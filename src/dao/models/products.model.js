const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
  id: String,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: String,
  code: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    require: true,
  },
})

productsSchema.plugin(paginate)

const ProductsModel = mongoose.model(productsCollection, productsSchema)

module.exports = ProductsModel

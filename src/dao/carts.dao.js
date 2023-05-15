const CartsModel = require('./models/carts.model')

class CartsDaoMongo {
  get = () => CartsModel.find()

  getById = (id) => CartsModel.findById(id)

  insert = (cart) => CartsModel.create(cart)

  updateById = (cart, id) => CartsModel.updateOne({ _id: id }, cart)

  deleteById = (id) => CartsModel.deleteById(id)
}

module.exports = new CartsDaoMongo()

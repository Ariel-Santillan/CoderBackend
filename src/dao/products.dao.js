const ProductsModel = require('./models/products.model')

class ProductsDaoMongo {
  get = () => ProductsModel.find()

  getById = (id) => ProductsModel.findById(id)

  insert = (product) => ProductsModel.create(product)

  updateById = (product, id) => ProductsModel.findByIdAndUpdate(id, product)

  deleteById = (id) => ProductsModel.deleteById(id)
}

module.exports = new ProductsDaoMongo()

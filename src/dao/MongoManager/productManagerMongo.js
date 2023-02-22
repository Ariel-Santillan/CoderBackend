const ProductsModel = require('../models/products.model')

class ProductManagerMongo {
  addProduct = async (product) => {
    const productAdded = await ProductsModel.create(product)
    return productAdded
  }

  getProducts = async (page = 1, limit = 10, sort = '', query = {}) => {
    return await ProductsModel.paginate(query, {
      page,
      limit,
      sort: { price: `${sort}` },
      lean: true,
    })
  }

  getById = async (id) => {
    const productFound = await ProductsModel.findById(id)
    if (productFound) {
      return productFound
    } else {
      throw new Error('Product not found')
    }
  }
}

module.exports = new ProductManagerMongo()

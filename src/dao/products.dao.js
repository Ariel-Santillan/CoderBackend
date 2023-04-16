const ProductsModel = require('./models/products.model')

class ProductsDaoMongo {
  get = () => ProductsModel.find()

  getById = (id) =>{
    console.log(id);
    const product = ProductsModel.findById(id)
    console.log(product);
    
  } 

  insert = (product) => ProductsModel.create(product)

  updateById = (product, id) => ProductsModel.findByIdAndUpdate(id, product)

  deleteById = (id) => ProductsModel.deleteById(id)
}

module.exports = new ProductsDaoMongo()

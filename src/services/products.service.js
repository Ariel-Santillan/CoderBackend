const productManagerMongo = require('../dao/MongoManager/productManagerMongo')
const ProductsModel = require('../dao/models/products.model')

const findById = async (id) => await ProductsModel.findById(id)

const getAll = async (page, limit, sort, query) =>
  await productManagerMongo.getProducts(page, limit, sort, query)

const add = async (product) => await productManagerMongo.addProduct(product)

const updateByID = async (pid, product) => await productManagerMongo.updateProduct(pid, product)

const deleteByID = async (id) => await productManagerMongo.deleteProduct(id)

module.exports = { findById, getAll, add, updateByID, deleteByID }

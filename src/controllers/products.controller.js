const { productService } = require('../services')
const {
  emitDeleteProduct,
  emitAddProduct,
  emitUpdateProduct,
} = require('../config/socket.io')
// const { body, validationResult } = require('express-validator')

const getProducts = async (req, res) => {
  try {
    const { page, limit, sort, ...query } = req.query
    const products = await productService.get()
    return res.json({
      status: 'Success',
      payload: products,
    })
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      payload: 'Error al intentar obtener los productos',
    })
  }
}

const getProductById = async (req, res) => {
  try {
    const pid = req.params.pid
    const productFound = await productService.getById(pid)
    return res.json({
      status: 'Success',
      payload: productFound,
    })
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      payload: error.message,
    })
  }
}

const addProduct = async (req, res) => {
  try {
    const product = req.body
    const productAdded = await productService.insert(product)
    emitAddProduct(productAdded)

    return res.json({
      status: 'Success',
      payload: productAdded,
    })
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      payload: error.message,
    })
  }
}

const updateProduct = async (req, res) => {
  try {
    const pid = req.params.pid
    const product = req.body
    await productService.updateById(product, pid)
    emitUpdateProduct(product)
    return res.json({
      status: 'Success',
      payload: `Product updated successfully`,
    })
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      payload: error.message,
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const pid = req.params.pid
    const deleted = await productService.deleteByID(pid)
    emitDeleteProduct(pid)
    if (deleted) {
      return res.json({
        status: 'Success',
        payload: 'Product sucessfully deleted',
      })
    } else {
      return res.status(404).json({
        status: 'Error',
        payload: `ID ${pid} was not found on the products collection`,
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      payload: error.message,
    })
  }
}

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
}

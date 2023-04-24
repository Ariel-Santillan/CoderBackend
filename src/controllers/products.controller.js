const { productService } = require('../services')
const {
  emitDeleteProduct,
  emitAddProduct,
  emitUpdateProduct,
} = require('../config/socket.io')
const CustomError = require('../utils/customError')
const {
  GET_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} = require('../utils/EErrors')
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
    CustomError.createError(500, error.message, GET_PRODUCT)
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
    CustomError.createError(500, error.message, GET_PRODUCT)
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
    CustomError.createError(500, error.message, CREATE_PRODUCT)
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
    CustomError.createError(500, error.message, UPDATE_PRODUCT)
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
    CustomError.createError(500, error.message, DELETE_PRODUCT)
  }
}

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
}

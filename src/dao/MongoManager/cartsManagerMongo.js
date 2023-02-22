const CartsModel = require('../models/carts.model')
const ProductsModel = require('../models/products.model')

class CartsManagerMongo {
  create = async (products) => {
    return await CartsModel.create({ products })
  }

  getByID = async (id) => {
    return await CartsModel.findById(id).lean().populate(
      'products.product'
    )
  }

  getAllCarts = async () => {
    return await CartsModel.find()
  }

  addProductToCart = async (cid, pid) => {
    const product = ProductsModel.findById(pid)
    if (!product) {
      return res.status(400).json({
        msg: 'Error',
        payload: `Product ${pid} not found`,
      })
    }

    const cartFound = await this.getCartByID(cid)
    const products = cartFound.products
    const productToUpdate = products.find((product) => product.id == pid)
    if (productToUpdate) {
      productToUpdate.quantity++
    } else {
      products.push({
        id: pid,
        quantity: 1,
      })
    }
    return this.updateCart(cid, quantityTotal, products)
  }

  deleteProductFromCartdID = async (cid, pid) => {
    const cartFound = await this.getCartByID(cid)
    const products = cartFound.products
    const productToUpdate = products.find((product) => product.id == pid)
    if (productToUpdate) {
      if (productToUpdate.quantity !== 0) {
        productToUpdate.quantity--
      } else {
        const productIndexToDelete = products.findIndex(
          (product) => product.id === pid
        )
        products.splice(productIndexToDelete, 1)
      }
      return this.updateCartByIDt(cid, products)
    } else {
      return res.status(400).json({
        status: 'Error',
        payload: `Error al intentar eliminar el producto ${pid} del carro ${cid}`,
      })
    }
  }

  updateCart = async (cid, cart) => {
    return await CartsModel.updateOne({ _id: cid }, cart)
  }

  updateProductInCartID = async (cid, cart) => {
    return await CartsModel.updateOne({ _id: cid }, cart)
  }
}

module.exports = new CartsManagerMongo()

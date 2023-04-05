const cartsService = require('../services/carts.service')
const productsService = require('../services/products.service')
const { mapProductCart, calculateCartTotal } = require('../config/carts')

const create = async (req, res) => {
  try {
    const { products = [] } = req.body

    const { productCartList, productsNotFound } = await mapProductCart(products)
    const cart = {
      totalPrice: calculateCartTotal(productCartList),
      totalQuantity: productCartList.length,
      products: productCartList,
    }

    await cartsService.create(productCartList)

    return res.json({
      status: 'Success',
      payload: { cart, productsNotFound },
    })
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      payload: error.message,
    })
  }
}

const getByID = async (req, res) => {
  try {
    const cid = req.params.cid
    const cartFound = await cartsService.getByID(cid)
    return res.json({
      status: 'Success',
      payload: cartFound,
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
    const { cid, pid } = req.params

    const cart = await validateCart(cid)

    await validateProductOnDB(pid)

    const productExistsInCart = cart.products.some(
      (product) => product._id === pid
    )

    if (!productExistsInCart) {
      return res.status(400).json({
        status: 'Error',
        payload: `El product ${pid} no existe en el carrito ${cid}`,
      })
    }

    cart.products.filter((product) => product._id != pid)
    cart.totalQuantity = cart.products.length
    cart.totalPrice = calculateCartTotal(cart.products)

    await cartsService.updateByID(cid, cart)

    res.json({
      status: 'Success',
      payload: 'Product deleted successfully',
    })
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      payload: error.message,
    })
  }
}

const updateAllProducts = async (req, res) => {
  try {
    const { cid } = req.params

    const cart = await validateCart(cid)

    const { products = [] } = req.body

    const { productCartList } = await mapProductCart(products)

    const cartUpdated = {
      products: productCartList,
      totalQuantity: productCartList.length,
      totalPrice: calculateCartTotal(productCartList),
    }

    await cartsService.updateByID(cid, cartUpdated)

    res.json({
      status: 'Success',
      payload: 'Cart updated successfully',
    })
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      payload: error.message,
    })
  }
}

const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const quantity = req.body

    let cart = await validateCart(cid)

    validateProductOnDB(pid)

    const indexProduct = cart.products.findIndex(
      ({ product }) => product._id == pid
    )

    if (indexProduct === -1) {
      return res.status(400).json({
        status: 'Error',
        payload: `El product ${pid} no existe en el carrito ${cid}`,
      })
    }

    cart.products[indexProduct].quantity += quantity

    cart = setCart(cart)

    await cartsService.updateByID(cid, cart)

    res.json({
      status: 'Success',
      payload: 'Cart updated successfully',
    })
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      payload: error.message,
    })
  }
}

const validateCart = async (cid) => {
  const cart = await cartsService.getByID(cid)

  if (!cart) {
    return res.status(400).json({
      status: 'Error',
      payload: `El carrito ${cid} no existe`,
    })
  }

  return cart
}

const validateProductOnDB = async (pid) => {
  const productExistsonDB = await productsService.findById(pid)

  if (productExistsonDB) {
    return res.status(400).json({
      status: 'Error',
      payload: `El producto ${pid} no existe en la base de datos`,
    })
  }
}

const setCart = async (cart) => {
  cart.products.filter((product) => product._id != pid)
  cart.totalQuantity = cart.products.length
  cart.totalPrice = calculateCartTotal(cart.products)

  return cart
}
module.exports = {
  create,
  getByID,
  // addProduct,
  deleteProduct,
  updateAllProducts,
  updateProductQuantity,
}

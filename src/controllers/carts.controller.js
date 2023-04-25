const { productService, cartService, ticketService } = require('../services')
const {
  mapProductCart,
  calculateCartTotal,
  getUserByID,
} = require('../config/carts')
const { v4: uuidv4 } = require('uuid')
const UserDTO = require('../dao/DTOs/user.dto')

const create = async (req, res) => {
  try {
    const { products = [], users } = req.body
    const { productCartList, productsNotFound } = await mapProductCart(products)
    const userFound = await getUserByID(users)
    let userDTO = new UserDTO(userFound)
    userDTO.user = users
    const cart = {
      totalPrice: calculateCartTotal(productCartList),
      totalQuantity: productCartList.length,
      products: productCartList,
      users: userDTO,
    }

    await cartService.insert(cart)

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
    const cartFound = await cartService.getById(cid)
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

    await cartService.updateById(cid, cart)

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

    await cartService.updateById(cid, cartUpdated)

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

    await cartService.updateById(cid, cart)

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
  const cart = await cartService.getById(cid)

  if (!cart) {
    return res.status(400).json({
      status: 'Error',
      payload: `El carrito ${cid} no existe`,
    })
  }

  return cart
}

const validateProductOnDB = async (pid) => {
  const productExistsonDB = await productService.getById(pid)

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

const validateStockOfProductByID = (products, idToFilter, quantity) => {
  const productFiltered = products.filter(
    (product) => product._id.toString() == idToFilter
  )
  return productFiltered[0].stock >= quantity
}

const purchaseCart = async (req, res) => {
  try {
    const cid = req.params.cid
    const cartFound = await cartService.getById(cid)

    const productsPurchased = []
    const productsNotPurchased = []

    const productsIDs = cartFound.products.map((product) => product.product)
    const productsFound = await productService.getAllProductsByIDs(productsIDs)

    cartFound.products.forEach((cartProduct) => {
      if (
        validateStockOfProductByID(
          productsFound,
          cartProduct.product._id.toString(),
          cartProduct.quantity
        )
      ) {
        productsPurchased.push(cartProduct)
      } else {
        productsNotPurchased.push(cartProduct)
      }
    })

    //Initialize ticket amount value to calculate total price
    let ticketAmount = 0
    let ticket = {}

    // console.log(cartFound.users[0].user);
    const userFound = await getUserByID(cartFound.users[0].user)
    const purchaser = userFound.email

    //If any product was able to purchase, then create the ticket
    if (productsPurchased.length > 0) {
      ticketAmount = calculateCartTotal(productsPurchased)

      ticket = {
        code: uuidv4(),
        amount: ticketAmount,
        purchaser: purchaser,
      }

      await ticketService.insert(ticket)
    }

    //Create a new cart with the products that didn´t have enough stock to buy
    let cartProductsNotPurchased = {}
    if (productsNotPurchased.length > 0) {
      cartProductsNotPurchased = {
        totalPrice: calculateCartTotal(productsNotPurchased),
        totalQuantity: productsNotPurchased.length,
        products: productsNotPurchased,
      }
      cartService.insert(cartProductsNotPurchased)
    }

    res.json({
      status: 'ok',
      msg: 'Ticket creado',
      ticket,
    })
  } catch (error) {
    res.json({
      status: 'error',
      msg: error.message,
    })
  }
}
module.exports = {
  create,
  getByID,
  // addProduct,
  deleteProduct,
  updateAllProducts,
  updateProductQuantity,
  purchaseCart,
}

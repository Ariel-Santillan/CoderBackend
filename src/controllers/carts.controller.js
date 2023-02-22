const ProductsModel = require('../dao/models/products.model')
const CartsManagerMongo = require('../dao/MongoManager/cartsManagerMongo')
const { mapProductCart, calculateCartTotal } = require('../utils/carts')

const create = async (req, res) => {
  try {
    const { products = [] } = req.body

    const { productCartList, productsNotFound } = await mapProductCart(products)
    const cart = {
      totalPrice: calculateCartTotal(productCartList),
      totalQuantity: productCartList.length,
      products: productCartList,
    }

    await CartsManagerMongo.create(productCartList)

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
    const cartFound = await CartsManagerMongo.getByID(cid)
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

// const addProduct = async (req, res) => {
//   try {
//     const { cid, pid } = req.params
//     const cart = await CartsManagerMongo.getByID(cid)

//     if (!cart) {
//       return res.status(400).json({
//         status: 'Error',
//         payload: `El carrito ${cid} no existe`,
//       })
//     }

//     const productExistsonDB = ProductsModel.findById(pid)

//     if (productExistsonDB) {
//       return res.status(400).json({
//         status: 'Error',
//         payload: `El producto ${pid} no existe en la base de datos`,
//       })
//     }

//     const productExistsInCart = cart.products.some(
//       (product) => product._id === pid
//     )

//     if (!productExistsInCart) {
//       return res.status(400).json({
//         status: 'Error',
//         payload: `El product ${pid} no existe en el carrito ${cid}`,
//       })
//     }

//     const product = cart.products.find((product) => {
//       return product?._id === pid
//     })

//     if (product) {
//       product.quantity++
//     } else {
//       cart.products.push({
//         product: pid,
//         quantity: 1,
//       })
//     }

//     const payload = await CartsManagerMongo.updateProductInCartID(cid, cart)

//     res.json({
//       msg: 'Success',
//       payload: payload,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       status: 'Error',
//       payload: error.message,
//     })
//   }
// }

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

    await CartsManagerMongo.updateCart(cid, cart)

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

    await CartsManagerMongo.updateCart(cid, cartUpdated)

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

    cart = setCart(cart) //Probar si anda este let o si no se puede hacer

    await CartsManagerMongo.updateCart(cid, cart)

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
  const cart = await CartsManagerMongo.getByID(cid)

  if (!cart) {
    return res.status(400).json({
      status: 'Error',
      payload: `El carrito ${cid} no existe`,
    })
  }

  return cart
}

const validateProductOnDB = async (pid) => {
  const productExistsonDB = ProductsModel.findById(pid)

  if (productExistsonDB) {
    return res.status(400).json({
      status: 'Error',
      payload: `El producto ${pid} no existe en la base de datos`,
    })
  }

  // return productExistsonDB
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

const { productService } = require("../services")
const { getByID } = require("../services/user.service")

const calculateCartTotal = (products) => {
  return products.reduce((acc, curr) => acc + curr.unitValue * curr.quantity, 0)
}

const mapProductCart = async (products) => {
  let productCartList = []
  let productsNotFound = []

  for (const productID of products) {
    const productIndex = productCartList.findIndex(
      ({ product }) => product === productID
    )

    if (productIndex === -1) {
      const productDb = await productService.getById(productID)

      if (productDb) {
        productCartList.push({
          product: productID,
          quantity: 1,
          unitValue: productDb.price,
        })
      } else {
        productsNotFound.push(productID)
      }
    } else {
      productCartList[productIndex].quantity++
    }
  }

  return { productCartList, productsNotFound }
}

const getUserByID = async (id) => {
  return await getByID(id)
}

module.exports = {
  calculateCartTotal,
  mapProductCart,
  getUserByID
}

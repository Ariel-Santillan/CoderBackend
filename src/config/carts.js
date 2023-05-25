const { productService, userService } = require("../services")

const calculateCartTotal = (products) => {
  return products.reduce((acc, curr) => acc + curr.unitValue * curr.quantity, 0)
}

const calculateTicketTotal = (products) => {
  return products.reduce((acc, curr) => acc + curr._doc.unitValue * curr._doc.quantity, 0)
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
  return await userService.getByID(id)
}

module.exports = {
  calculateCartTotal,
  mapProductCart,
  getUserByID,
  calculateTicketTotal
}

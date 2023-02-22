const ProductManagerMongo = require("../dao/MongoManager/productManagerMongo")

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
      const productDb = await ProductManagerMongo.getById(productID)

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

module.exports = {
  calculateCartTotal,
  mapProductCart,
}

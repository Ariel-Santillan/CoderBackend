const fs = require('fs')

class ProductAssetManager {
  constructor(path) {
    this.path = path
  }

  createFile = async () => {
    await fs.promises.writeFile(this.path, this.products)
  }
}

const ProductAssets = new ProductAssetManager('./assets/products.json')
module.exports = ProductAssets

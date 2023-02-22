const fs = require ('fs')
const path = './src/assets/Carts.json' //ponerle dirname

class CartManager {
  constructor(path){
    this.path = path
    this.carts = []
    this.createFile()
  }

  checkIfFileExists = () => {
    //Check if file exists
    return fs.existsSync(this.path)
  }
  
  readFile = async () => {
    //Read file and return data
    const fileExistingData = await fs.promises.readFile(this.path, {encoding : 'utf-8'})
    const fileDataParsed = JSON.parse(fileExistingData ? fileExistingData : "[]")
    return fileDataParsed
  }
  
  writeFile = async (carts) => {
    await fs.promises.writeFile(this.path, JSON.stringify(carts ? carts : "[]" ))
  }

  createFile = async () => {
    if(!this.checkIfFileExists){
      await writeFile(this.path, this.carts)
    }
  }
  addCart = async () => {
    const carts = await this.readFile()
    const id = carts.length
    carts.push({
      id,
      products: []
    })
    this.writeFile(carts)
    return id
  }

  getCartByID = async (id) => {
    const carts = await this.readFile()
    return carts[id] ? carts[id] : new Error("Cart ID not found")
  }

  getAllCarts = async () => {
    const carts = await this.readFile()
    return carts
  }

  addProductToCart = async (cid, pid) => {
    const carts = await this.getAllCarts()
      const productIndex = carts[cid].products.findIndex( (p) => p.id == pid )
      if (productIndex !== -1){
        carts[cid].products[productIndex].quantity++
      }else{
        carts[cid].products.push( { id: pid, quantity: 1 } )
      }
    await this.writeFile(carts)
  }

}

const cartManager = new CartManager(path)
module.exports = cartManager
const fs = require ('fs')

class ProductManager{
constructor(path) {
  this.products = []
  this.path = path
}

#checkIfFileExists (path){
  //Check if file exists
  return fs.existsSync(this.path)
}

addProduct = async ({title, description, price, thumbnail, code, stock}) => {
  //Validate NON empty input values
  if (title && description && price && thumbnail && code && stock){
    //Validate NON repeated code value
    let codeAlreadyExists = this.products.map(prod => prod.code).includes(code)
    const id = this.products.length + 1
    if(!codeAlreadyExists){
      //Validate if file already exists
      const fileExists = this.#checkIfFileExists(this.path)
      if(!fileExists){
        //Create file
        await fs.promises.writeFile(this.path, JSON.stringify([{
          id,
          title,
          description,
          price,
          thumbnail,
          code,
          stock
        }]))
      }else{
        //Read file and append new data
        const fileExistingData = await this.getProducts(this.path)
        const id = fileExistingData.length + 1
        await fs.promises.writeFile(this.path, JSON.stringify([...fileExistingData, {
          id,
          title,
          description,
          price,
          thumbnail,
          code,
          stock
        }]))

      }

}else{
  console.error(`El code ${code} ya existe`)
}
}else{
console.error(`Faltó ingresar algún valor`)
}
}


getProducts = async () => {
  const fileExists = this.#checkIfFileExists(this.path)
  if(fileExists){
    //Read file and return data
    const fileExistingData = await fs.promises.readFile(this.path, {encoding : 'utf-8'})
    const fileDataParsed = JSON.parse(fileExistingData)
    return fileDataParsed
  }else{
    //If file doesn´t exists return empty array
    return []
  }
}

getProductsById = async (id) => {
  const products = await this.getProducts(this.path)
  let productFound = products.find((product) => product.id === id)
  if(productFound){
    return productFound
  }else{
    console.error('Not found')
  }
}

#getPositionOfArrayValue = async (id) => {
  //Check if ID exists
  const productFound = await this.getProductsById(id)
  //As when creating a product, the ID will be the lenght + 1, now the ID to replace/delete should be the input - 1
  const positionFromArray = id - 1
  return positionFromArray
}
updateProduct = async (id, newProduct) =>{
  const products = await this.getProducts()
  const positionToReplace = await this.#getPositionOfArrayValue(id)
  newProduct.id = positionToReplace + 1
  products.splice(positionToReplace, 1, newProduct)
  await fs.promises.writeFile(this.path, JSON.stringify([...products]))
}

deleteProduct = async (id) => {
  const products = await this.getProducts()
  const positionToDelete = await this.#getPositionOfArrayValue(id)
  products.splice(positionToDelete, 1)
  await fs.promises.writeFile(this.path, JSON.stringify([...products]))
}

}


const product1 = {
  title: "producto prueba",
	description: "Este es un producto prueba",
	price: "200",
	thumbnail: "Sin imagen",
	code: "abc123",
	stock: "25",
}

const product2 = {
  title: "producto prueba",
	description: "Este es un producto prueba",
	price: "200",
	thumbnail: "Sin imagen",
	code: "abc123",
	stock: "25",
}

const newProduct1 = {
  title: "producto prueba",
	description: "Este es un producto prueba",
	price: "250",
	thumbnail: "Sin imagen",
	code: "abc123",
	stock: "25",
}


const testing = async () => {
  const path = './Files/MyFile.json'
  const productManager = new ProductManager(path)
  let products = await productManager.getProducts()
  await productManager.addProduct(product1)
  products = await productManager.getProducts()
  const productById = await productManager.getProductsById(1)
  await productManager.updateProduct(1, newProduct1)
  products = await productManager.getProducts()
  await productManager.deleteProduct(1)
}

testing()
const fs = require ('fs')

class ProductManager{
constructor(path) {
  this.products = []
  this.path = path
}

#checkIfFileExists (){
  //Check if file exists
  return fs.existsSync(this.path)
}

addProduct = async ({title, description, price, status = true, category, code, stock}) => {
  //Validate NON empty input values
  if (title && description && price && category && code && stock){
    //Read file and append new data
    const fileExistingData = await this.getProducts(this.path)
    //Set constants values
    const id = fileExistingData.length + 1
    const thumbnail = ''
    //Build newProduct JSON
    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    }
    //Validate NON repeated code value
      const codeAlreadyExists = fileExistingData.find( (product) => product.code === code)
      if(!codeAlreadyExists){
        await fs.promises.writeFile(this.path, JSON.stringify([...fileExistingData, newProduct]))
      }else{
      console.log("Código repetido")
      throw new Error(`The code ${code} already exists`)
      }
  return newProduct
  }else{
  throw new Error(`Faltó ingresar algún valor`)
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

getProductById = async (id) => {
  const products = await this.getProducts(this.path)
  this.products = products
  const idToSearch = id - 1
  const productFound = this.products.find( (product) => product.id == id)
  if(productFound){
    return productFound 
  } else {
    throw new Error ('Product not found')
  }
}

#getPositionOfArrayValue = async (id) => {
  //Check if ID exists
  try {
    const productFound = await this.getProductById(id)
    const positionFromArray = this.products.findIndex(
			(product) => product.id == id
		)
    //As when creating a product, the ID will be the lenght + 1, now the ID to replace/delete should be the input - 1
    // const positionFromArray = id - 1
    return positionFromArray
  } catch (error) {
    throw new Error(error.message)
  }
}
updateProduct = async (id, newProduct) =>{
  try {
    const products = await this.getProducts()
    const positionToReplace = await this.#getPositionOfArrayValue(id)
    newProduct.id = positionToReplace + 1
    products.splice(positionToReplace, 1, newProduct)
    await fs.promises.writeFile(this.path, JSON.stringify([...products]))
  } catch (error) {
    throw new Error(error.message)
  }
}

deleteProduct = async (id) => {
  try {
    await this.getProductById(id)
    const newProducts = this.products.filter((product) => product.id != id)
    await fs.promises.writeFile(this.path, JSON.stringify([...newProducts]))
  } catch (error) {
    throw new Error(error.message)
  }
}
}

module.exports = ProductManager
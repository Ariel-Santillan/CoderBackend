class ProductManager{
  constructor() {
    this.products = []
  }
  
  
  addProduct = (title, description, price, thumbnail, code, stock) => {
    if (title && description && price && thumbnail && code && stock){
      let codeAlreadyExists = this.products.map(prod => prod.code).includes(code)
      if(!codeAlreadyExists){
        this.products.push({
          id: this.products.length,
          title,
          description,
          price,
          thumbnail,
          code,
          stock
        })
      }else{
        console.error(`El code ${code} ya existe`)
      }
    }else{
      console.error(`Faltó ingresar algún valor`)
    }
  }
  
  getProducts = () => {
    console.log(this.products)
  }
  
  getProductsById(id) {
    let productFound = this.products.find((prodId) => prodId === id)
    if(productFound){
      console.log(productFound)
    }else{
      console.error('Not found')
    }
  }
  
  }
    
    
  const productManager = new ProductManager  
  productManager.getProducts()
  productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
  productManager.getProducts()
  productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
  productManager.getProductsById(0)
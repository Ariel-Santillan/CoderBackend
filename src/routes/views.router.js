const { Router } = require('express')
const ChatsManagerMongo = require('../dao/MongoManager/chatsManagerMongo')
const CartsManagerMongo = require('../dao/MongoManager/cartsManagerMongo')
const ProductManagerMongo = require('../dao/MongoManager/productManagerMongo')
const { generateProduct } = require('../utils/faker')

const router = Router()

router.get('/realTimeProducts', async (req, res) => {
  res.render('realTimeProducts')
})

router.get('/products', async (req, res) => {
  const products = await getProducts(req)

  if (req.session.user) {
    res.render('products', {
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      age: req.session.user.age,
      role: req.session.admin ? 'admin' : 'usuario',
      products: products,
    })
  } else {
    res.render('login')
  }
})

router.get('/chats', async (req, res) => {
  const chats = await ChatsManagerMongo.getMessages()
  res.render('chat')
})

router.get('/carts', async (req, res) => {
  const cid = req.query.cid
  const cart = await CartsManagerMongo.getByID(cid)
  res.render('cart', cart)
})

router.get('/', async (req, res) => {
  if (req.session.user) {
    const products = await getProducts(req)

    res.render('products', {
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      age: req.session.user.age,
      role: req.session.admin ? 'admin' : 'usuario',
      products: products,
    })
  } else {
    res.render('login')
  }
})

router.get('/registrar', async (req, res) => {
  if (req.session.user) {
    const products = await getProducts(req)

    res.render('products', {
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      age: req.session.user.age,
      role: req.session.admin ? 'admin' : 'usuario',
      products: products,
    })
  } else {
    res.render('register')
  }
})

const getProducts = async (req) => {
  const { page, limit, sort, ...query } = req.query
  let products = await ProductManagerMongo.getProducts(page, limit, sort, query)

  products.prevLink = products.hasPrevPage
    ? `http://localhost:8080/products?page=${products.prevPage}`
    : ''
  products.nextLink = products.hasNextPage
    ? `http://localhost:8080/products?page=${products.nextPage}`
    : ''
  products.isValid = !(page <= 0 || page > products.totalPages)

  return products
}

router.get('/mockingproducts', (req, res) => {
  const products = []
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct())
  }

  res.send(products)

  return products
})

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password')
})
router.get('/recover-password', (req, res) => {
  res.render('recover-password')
})

router.get('/manage-users', (req, res) => {
  res.render('manageUsers')
})

module.exports = router

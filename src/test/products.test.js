const chai = require('chai')
const supertest = require('supertest')
const { generateProduct } = require('../utils/faker')

const expect = chai.expect
const requester = supertest('http://localhost:8080/')

describe('Products tests', () => {
  it('Find a product by ID', async () => {
    const pid = '63f5748c7b20b0b0675f165d'
    const {
      _body
    } = await requester.get(`api/products/${pid}`)

    expect(_body.payload.title).to.be.equal('Coca Cola Original 1.75 lts')
  })

  it('Create a new product', async () => {

    const mockOwner = '641a51f4d77b94167bec5b78'
    const mockProduct = generateProduct()
    const { description } = mockProduct
    mockProduct.owner = mockOwner
    const {
      statusCode,
      _body
    } = await requester.post('api/products').send(mockProduct)

    expect(statusCode).to.be.ok
    expect(_body.payload.description).to.be.equal(description)

  })

  it('Update the price of a product', async () => {
    const pid = '63f5748c7b20b0b0675f165d'

    //Get original product
    const {
      _body
    } = await requester.get(`api/products/${pid}`)
  
    //Init product retrieved on a variable
    const product = _body.payload
    const newPrice = 5000
    product.price = newPrice

    //Update product price
    const putRequest = await requester.put(`api/products/${pid}`).send(product)

    //Get product again to validate price again

    const productUpdated = await requester.get(`api/products/${pid}`)
    expect(productUpdated._body.payload.price).to.be.equal(newPrice)
  })
})

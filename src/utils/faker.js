const { faker } = require('@faker-js/faker')

faker.locale = 'es'

const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.image(),
    code: faker.random.alphaNumeric(6),
    stock: faker.random.numeric(2),
  }
}

const generateUser = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(8),
    age: faker.random.numeric(2),
    role: "premium" 
  }
}

module.exports = { generateProduct, generateUser }

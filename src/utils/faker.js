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

module.exports = { generateProduct }

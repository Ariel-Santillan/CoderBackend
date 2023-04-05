const cartsManagerMongo = require('../dao/MongoManager/cartsManagerMongo')

const create = async (productCartList) => await cartsManagerMongo.create(productCartList)

const createByID = async (id) => await cartsManagerMongo.getByID(id)

const updateByID = async (id, cart) => cartsManagerMongo.updateCart(id, cart)

module.exports = { create, createByID, updateByID }

const usersManagerMongo = require("../dao/MongoManager/usersManagerMongo")

const login = async (email, password) => usersManagerMongo.login(email, password)

const register = async (user) => usersManagerMongo.register(user)

const getByID = async (id) => usersManagerMongo.getByID(id)

module.exports = {login, register, getByID}
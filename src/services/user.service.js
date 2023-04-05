const usersManagerMongo = require("../dao/MongoManager/usersManagerMongo")

const login = async (email, password) => usersManagerMongo.login(email, password)

const register = async (user) => usersManagerMongo.register(user)

module.exports = {login, register}
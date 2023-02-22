const UsersModel = require('../models/users.model')

class UsersManagerMongo {
  login = async (email, password) => {
    return await UsersModel.findOne({ email, password })
  }

  register = async (user) => {
    return await UsersModel.create(user)
  }
}

module.exports = new UsersManagerMongo()

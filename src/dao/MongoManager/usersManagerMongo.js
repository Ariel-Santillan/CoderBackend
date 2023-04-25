const { passwordHash, passwordCompare } = require('../../config/bcrypt')
const UsersModel = require('../models/users.model')

class UsersManagerMongo {
  login = async (email, password) => {
    const user = await UsersModel.findOne({ email })
    const isValidPassword = passwordCompare(password, user.password)
    if (user && isValidPassword) {
      return user
    } else {
      res.status(401).send('Email o contraseña incorrectos')
    }
  }

  register = async (user) => {
    const hash = passwordHash(user.password)
    return await UsersModel.create({ ...user, password: hash })
  }

  getByID = async (id) => {
    return await UsersModel.findById(id)
  }
}

module.exports = new UsersManagerMongo()

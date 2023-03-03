const { passwordHash, passwordCompare } = require('../../utils/bcrypt')
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
}

module.exports = new UsersManagerMongo()

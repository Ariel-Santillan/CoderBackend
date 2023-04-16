const UsersModel = require('./models/users.model')

class UsersDaoMongo {
  get = () => UsersModel.find()

  getById = (id) => UsersModel.findById(id)

  insert = (user) => UsersModel.create(user)

  updateById = (user, id) => UsersModel.findByIdAndUpdate(id, user)

  deleteById = (id) => UsersModel.deleteById(id)
}

module.exports = new UsersDaoMongo()

const UsersModel = require('./models/users.model')

class UsersDaoMongo {
  get = () => UsersModel.find()

  getByID = (id) => UsersModel.findById(id)

  insert = (user) => UsersModel.create(user)

  updateById = (user, id) => UsersModel.findByIdAndUpdate(id, user)

  deleteById = (id) => UsersModel.deleteById(id)

  updatePassword = (newPassword, id) =>
    UsersModel.findByIdAndUpdate(id, { password: newPassword })

  getByEmail = async (email) => UsersModel.find({email: email})

  updatedocs = (id, docs) => UsersModel.findByIdAndUpdate(id , docs)

}

module.exports = new UsersDaoMongo()

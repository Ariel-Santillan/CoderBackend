const mongoose = require('mongoose')

const roles = ['admin', 'superadmin', 'user', 'premium']
const usersCollection = 'usersLogin'

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    integer: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts',
  },
  role: {
    type: String,
    default: 'user',
    enum: roles,
    required: true,
  },
  documents: {
    type: [
      
    ]
  },
  last_connection: {
    type: String,
    default: mongoose.now()
  }
})

const UsersModel = mongoose.model(usersCollection, UserSchema)

module.exports = UsersModel

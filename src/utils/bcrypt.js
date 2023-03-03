const bcrypt = require('bcrypt')

const passwordHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const passwordCompare = (password, hash) =>
  bcrypt.compareSync(password, hash)

module.exports = { passwordHash, passwordCompare }

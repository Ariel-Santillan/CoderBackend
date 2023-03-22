const { COOKIE_USER } = require('../utils/constants')

const login = async (req, res) => {
  req.session.user = {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          age: req.user.age,
          email: req.user.email,
        }
  res
    .cookie(COOKIE_USER, req.user.token, { maxAge: 300000, httpOnly: true })
    .send(req.user)
}

const register = async (req, res) => {
  res.send(req.user)
}
const getCurrent = async (req, res) => {
  res.send(req.user)
}

module.exports = {
  login,
  register,
  getCurrent,
}

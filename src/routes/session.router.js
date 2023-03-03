const { Router } = require('express')
const usersController = require('../controllers/users.controller')
const passport = require('passport')
const { STRATEGY_REGISTER, STRATEGY_LOGIN } = require('../utils/constants')

const router = Router()

router.post(
  '/login',
  passport.authenticate(STRATEGY_LOGIN),
  async (req, res) => {
    req.session.user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email
    }
    res.send(req.user)
  }
)

router.post(
  '/register',
  passport.authenticate(STRATEGY_REGISTER),
  async (req, res) => {
    res.send(req.user)
  }
)

router.get('/logout', usersController.logout)

module.exports = router

const { Router } = require('express')
const usersController = require('../controllers/users.controller')
const passport = require('passport')
const { STRATEGY_REGISTER, STRATEGY_LOGIN } = require('../utils/constants')

const router = Router()

router.post(
  '/login',
  passport.authenticate(STRATEGY_LOGIN),
  usersController.login
)

router.post(
  '/register',
  passport.authenticate(STRATEGY_REGISTER),
  usersController.register
)

router.get('/logout', usersController.logout)

module.exports = router

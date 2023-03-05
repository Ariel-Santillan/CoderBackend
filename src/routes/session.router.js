const { Router } = require('express')
const usersController = require('../controllers/users.controller')
const passport = require('passport')
const {
  STRATEGY_REGISTER,
  STRATEGY_LOGIN,
  STRATEGY_GITHUB,
} = require('../utils/constants')

const router = Router()

//Login
router.post(
  '/login',
  passport.authenticate(STRATEGY_LOGIN),
  async (req, res) => {
    req.session.user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email,
    }
    res.send(req.user)
  }
)

//Register
router.post(
  '/register',
  passport.authenticate(STRATEGY_REGISTER),
  async (req, res) => {
    res.send(req.user)
  }
)

//Logout
router.get('/logout', usersController.logout)

//Github
router.get('/github', passport.authenticate({ scope: ['user:email'] }), async (req, res) => {
})

router.get(
  '/callbackGithub',
  passport.authenticate(STRATEGY_GITHUB, { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.user = req.user
    res.redirect('/')
  }
)
module.exports = router

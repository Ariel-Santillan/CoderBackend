const { Router } = require('express')
const usersController = require('../controllers/users.controller')
const passport = require('passport')
const {
  STRATEGY_REGISTER,
  STRATEGY_LOGIN,
  STRATEGY_GITHUB,
} = require('../utils/constants')
const passportCustom = require('../utils/passportCall')

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
router.get(
  '/github',
  passport.authenticate(STRATEGY_GITHUB, { scope: ['user:email'] })
)

router.get(
  '/callbackGithub',
  passport.authenticate(STRATEGY_GITHUB, { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.user = req.user
    res.redirect('/')
  }
)


//current
const authorization = (role) => {
  //damos autorizacion solo a los que sean el role
  return (req, res, next) => {
    if (!req.user)
      return res
        .status(401)
        .send({ status: 'error', msg: 'The header does not contain any user' })
    if (req.user.role != role)
      return res.status(403).send({ status: 'error', msg: 'Not authorized' })

    next()
  }
}

router.get(
  '/current',
  passportCustom('jwt'),
  authorization('user'),
  (req, res) => {
    res.send(req.user)
  }
)
module.exports = router

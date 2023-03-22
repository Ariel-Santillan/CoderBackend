const { Router } = require('express')
const usersController = require('../controllers/users.controller')
const passport = require('passport')
const {
  STRATEGY_REGISTER,
  STRATEGY_LOGIN,
  STRATEGY_GITHUB,
  STRATEGY_JWT,
} = require('../utils/constants')
const passportCustom = require('../utils/passportCall')
const sessionController = require('../controllers/session.controller')

const router = Router()

//Login
router.post(
  '/login',
  passport.authenticate(STRATEGY_LOGIN, { session: false }),
  sessionController.login
)

//Register
router.post(
  '/register',
  passport.authenticate(STRATEGY_REGISTER, { session: false }),
  sessionController.register
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

// //current
// const authorization = (role) => {
//   //damos autorizacion solo a los que sean el role
//   return (req, res, next) => {
//     if (!req.user)
//       return res
//         .status(401)
//         .send({ status: 'error', msg: 'The header does not contain any user' })
//     if (req.user.role != role)
//       return res.status(403).send({ status: 'error', msg: 'Not authorized' })

//     next()
//   }
// }

router.get(
  '/current',
  passportCustom(STRATEGY_JWT),
  sessionController.getCurrent
  // authorization('user'),
  // (req, res) => {
  //   res.send(req.user)
  // }
)
module.exports = router

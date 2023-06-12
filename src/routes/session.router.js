const { Router } = require('express')
const usersController = require('../controllers/users.controller')
const passport = require('passport')

const passportCustom = require('../config/passportCall')
const sessionController = require('../controllers/session.controller')
const { STRATEGY_REGISTER,
  STRATEGY_LOGIN,
  STRATEGY_GITHUB,
  STRATEGY_JWT, } = require('../utils/constants')
const multerUtils = require('../utils/multer.utils')

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
  passport.authenticate(
    STRATEGY_GITHUB,
    { scope: ['user.email'], session: false },
    async () => {}
  )
)

router.get(
  '/callbackGithub',
  passport.authenticate(STRATEGY_GITHUB, { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.user = req.user
    res.redirect('/')
  }
)

router.get(
  '/current',
  passportCustom(STRATEGY_JWT),
  sessionController.getCurrent
)

router.post('/forgot-password', sessionController.forgotPassword);

router.post('/reset-password/:token', sessionController.recoverPassword);

router.post(
  '/:uid/documents',
  (req, res, next) => {
    next();
  },
  multerUtils.fields('file'),
  // saveDocs,
  // viewSession.uploadDocs
);


module.exports = router

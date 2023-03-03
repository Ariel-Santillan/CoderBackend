const passport = require('passport')
const local = require('passport-local')
const UsersModel = require('../dao/models/users.model')
const { passwordHash, passwordCompare } = require('./bcrypt')
const { STRATEGY_REGISTER, STRATEGY_LOGIN } = require('./constants')

const InitPassport = () => {
  passport.use(
    STRATEGY_REGISTER,
    new local.Strategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        const { firstName, lastName, age } = req.body
        try {
          const userExists = await UsersModel.findOne({ email: username })
          if (userExists) {
            done(null, false)
          } else {
            const hash = passwordHash(password)
            const user = await UsersModel.create({
              firstName,
              lastName,
              age,
              email: username,
              password: hash,
            })
            done(null, user)
          }
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.use(
    STRATEGY_LOGIN,
    new local.Strategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await UsersModel.findOne({ email: username })
          if (!user) {
            console.log('User doesn´t exists')
            return done(null, false)
          }
          const isValidPassword = passwordCompare(password, user.password)
          if (!isValidPassword) {
            return done(null, false)
          }
          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser(async (id, done) => {
    const user = await UsersModel.findById(id)
    done(null, user)
  })
}

module.exports = { InitPassport }

const passport = require('passport')
const local = require('passport-local')
const UsersModel = require('../dao/models/users.model')
const { passwordHash, passwordCompare } = require('./bcrypt')

const GitHubStrategy = require('passport-github2')
const jwt = require('passport-jwt')
const { generateToken } = require('./jwt')
const { STRATEGY_REGISTER,
  STRATEGY_LOGIN,
  STRATEGY_GITHUB,
  GITHUB_CLIENTID,
  GITHUB_SECRET,
  STRATEGY_JWT,
  JWT_PRIVATEKEY,
  COOKIE_USER, } = require('../utils/constants')

//username y password
const JWTEstrategy = jwt.Strategy
const JWTExtract = jwt.ExtractJwt

const cookieExtractor = (req) => {
  let token = null

  if (req && req.cookies) {
    token = req.cookies[COOKIE_USER]
  }

  return token
}

const InitPassport = () => {

  //JWT
  passport.use(
    STRATEGY_JWT,
    new JWTEstrategy(
      {
        jwtFromRequest: JWTExtract.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_PRIVATEKEY,
      },
      async (jwt_payload, done) => {
        try {
          console.log('jwt')
          const { payload } = jwt_payload
          const user = await UsersModel.findById(payload.id)
          delete user._doc.password
          console.log(user)
          done(null, { user: user._doc })
        } catch (error) {
          done(error)
        }
      }
    )
  )

  //Register
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

  //Login
  passport.use(
    STRATEGY_LOGIN,
    new local.Strategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await UsersModel.findOne({ email: username })
          if (!user) {
            console.log('User doesn´t exists')
            done(null, false)
          }
          const isValidPassword = passwordCompare(password, user.password)
          if (!isValidPassword) {
            done(null, false)
          }
          const token = generateToken({ id: user.id, rol: user.role })
          if(token){
            done(null, {user: user, token:token})
          }
        } catch (error) {
          done(error)
        }
      }
    )
  )

  //Github Login
  passport.use(
    STRATEGY_GITHUB,
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENTID,
        clientSecret: GITHUB_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/callbackGithub',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UsersModel.findOne({ email: profile._json.email })
          if (!user) {
            if (!profile._json.name) {
              let firstName = 'Nombre'
            }

            firstName = profile._json.name

            if (!profile._json.email) {
              let email = 'mail@mail.com'
            }

            email = profile._json.email

            user = {
              firstName: firstName,
              lastName: '',
              age: 20,
              email: email,
              password: '',
            }
            const newUser = await UsersModel.create(user)
            done(null, newUser)
          } else {
            done(null, user)
          }
        } catch (error) {
          done(error)
        }
      }
    )
  )
}

module.exports = { InitPassport }

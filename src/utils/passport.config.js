const passport = require('passport')
const local = require('passport-local')
const UsersModel = require('../dao/models/users.model')
const { passwordHash, passwordCompare } = require('./bcrypt')
const {
  STRATEGY_REGISTER,
  STRATEGY_LOGIN,
  STRATEGY_GITHUB,
  GITHUB_CLIENTID,
  GITHUB_SECRET,
  STRATEGY_JWT,
  JWT_PRIVATEKEY,
} = require('./constants')
const GitHubStrategy = require('passport-github2')
const jwt = require('passport-jwt')
const NewUsersModel = require('../dao/models/newUsers.model')

//username y password
const JWTEstrategy = jwt.Strategy
const JWTExtract = jwt.ExtractJwt

const cookieExtractor = (req) => {
  let token = null

  if (req && req.cookies) {
    token = req.cookies['token-coder']
  }

  return token
}

const InitPassport = () => {
  //Nuevo

  passport.use(
    STRATEGY_JWT,
    new JWTEstrategy(
      {
        jwtFromRequest: JWTExtract.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_PRIVATEKEY,
      },
      async (jwt_payload, done) => {
        try {
          console.log({ jwt_payload })
          const user = await NewUsersModel.findById(jwt_payload.id)
          done(null, { user: user, role: jwt_payload.role })
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
          const userExists = await NewUsersModel.findOne({ email: username })
          if (userExists) {
            done(null, false)
          } else {
            const hash = passwordHash(password)
            const user = await NewUsersModel.create({
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
          const user = await NewUsersModel.findOne({ email: username })
          if (!user) {
            console.log('User doesn´t exists')
            done(null, false)
          }
          const isValidPassword = passwordCompare(password, user.password)
          if (!isValidPassword) {
            done(null, false)
          }
          console.log('passport')
          done(null, user)
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
          let user = await NewUsersModel.findOne({ email: profile._json.email })
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
            const newUser = await NewUsersModel.create(user)
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

  //Serialize user
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  //Deserialize user
  passport.deserializeUser(async (id, done) => {
    const user = await NewUsersModel.findById(id)
    done(null, user)
  })
}

module.exports = { InitPassport }

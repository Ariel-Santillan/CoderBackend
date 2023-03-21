const { Router } = require('express')
const UsersModel = require('../dao/models/users.model')
const { JWT_PRIVATEKEY, STRATEGY_REGISTER } = require('../utils/constants')
const { hashPassword, comparePassword } = require('../utils/bcrypt')
const passport = require('passport')
const { generateToken } = require('../utils/jwt')
const passportCustom = require('../utils/passportCall')
const jwt = require('jsonwebtoken')
const router = Router()

// const login = async (email, password) => {
//   try {
//     const user = await UsersModel.findOne({ email })
//     if (!user) {
//       throw new Error('The user does not exists')
//     } else {
//       const isValid = await bcrypt.compare(password, user.password)
//       if (!isValid) {
//         throw new Error('Incorrect user or password')
//       } else {
//         delete user._doc.password
//         const token = jwt.sign({ user }, JWT_PRIVATEKEY, { expiresIn: '10h' })
//         return token
//       }
//     }
//   } catch (error) {
//     throw new Error(error.message)
//   }
// }

//Nuevo

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await UsersModel.findOne({ email })
  const isValidPassword = await comparePassword(password, user.password)
  if (user && isValidPassword) {
    const token = generateToken({ id: user.id, role: 'user' })
    console.log("auth controller");
    res
      .cookie('token-coder', token, { maxAge: 30000, httpOnly: true })
      .send({ user })
  } else {
    res.status(401).send('Incorrect email or password')
  }
})

router.post(
  '/register',
  passport.authenticate(STRATEGY_REGISTER),
  async (req, res) => {
    res.send(req.user)
  }
)

router.post('/forgot-password', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await UsersModel.findOne({ email })
    if (user) {
      const hash = await hashPassword(password)
      await UsersModel.updateOne({ email }, { password: hash })
      res.send(user)
    } else {
      res.status(404).send('Email no encontrado')
    }
  } catch (error) {
    console.log(error)
    res.status(500).send('Error al crear usuario')
  }
})

router.get(
  '/current',
  passportCustom('jwt'),
  authorization('user'),
  (req, res) => {
    res.send(req.user)
  }
)

module.exports = { login }

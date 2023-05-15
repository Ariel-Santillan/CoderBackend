const { generateEmailToken } = require('../config/jwt')
const UsersModel = require('../dao/models/users.model')
const SessionService = require('../services/session.service')
const {
  COOKIE_USER,
  FORGOT_PASSWORD_MESSAGE,
  FORGOT_PASSWORD_SUBJECT,
} = require('../utils/constants')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/customError')

const sessionService = new SessionService()

const login = async (req, res) => {
  req.session.user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    age: req.user.age,
    email: req.user.email,
  }
  res
    .cookie(COOKIE_USERER, req.user.token, { maxAge: 300000, httpOnly: true })
    .send(req.user)
}

const register = async (req, res) => {
  res.send(req.user)
}
const getCurrent = async (req, res) => {
  res.send(req.user)
}
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await sessionService.getByEmail(email)

    const token = generateEmailToken(email)

    if (!user) {
      return next (CustomError.createError({code:ERROR_USER, msg: invalidEmail(), typeError:"ERROR_USER"})) 
    }
    //Send email
    const emailMessage =
      'a href=`//localhost:8080/forgot-password/${token}`>Reset password</a>'
    mailingService.sendMail({
      to: req.user.email,
      subject: FORGOT_PASSWORD_SUBJECT,
      html: emailMessage,
    })
  } catch (error) {}
  if (req.session.user) {
    res.render('perfil', { name: req.session.user.first_name })
  } else {
    res.render('forgot-password')
  }
}

const forgotPasswordToken = async (req, res) => {
  res.cookie('token', token, { httpOnly: true, secure: true })
}

const resetPassword = async (req, res) => {
  const { password } = req.body
  token = req.cookie.token
  jwt.verify(token, JWT_PRIVATEKEY, (e, credential) => {
    console.log(credential)
    if (e) {
      res.send('New password cannot be the same as old password')
    } else {
      UsersModel.updateOne({ email }, { password: hash })
    }
  })
}

module.exports = {
  login,
  register,
  getCurrent,
  forgotPassword,
  forgotPasswordToken,
  resetPassword,
}

const { generateToken } = require('../config/jwt')
const { FORGOT_PASSWORD_SUBJECT } = require('../utils/constants')
const CustomError = require('../utils/customError')
const { passwordHash, passwordCompare } = require('../config/bcrypt')
const UsersDaoMongo = require('../dao/user.dao')
const { userService } = require('../services')
const mailingService = require('../services/mailing.service')

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

const forgotPassword = async (req, res, next) => {
  try {
    let { email } = req.body
    const user = await userService.getByEmail(email)
    if (!user) {
      return next(
        CustomError.createError({
          code: ERROR_USER,
          msg: invalidEmail(),
          typeError: 'ERROR_USER',
        })
      )
    }
    const token = generateToken({ id: user.id })
    mailingService.sendMail({
      to: email,
      subject: FORGOT_PASSWORD_SUBJECT,
      html: `<a href="http://localhost:8080/api/sessions/redirectForgotPassword/${token}">Reset password</a>`,
    })
    res.json({
      status: 'Success',
      message: 'Recover password email sent',
    })
  } catch (error) {
    return res.send({ status: 'error', message: 'Invalid email' })
  }
}

const redirectRecoverPassword = (req, res, next) => {
  try {
    const token = req.params.token
    res.cookie('token', token).redirect(`/recover-password`)
  } catch (error) {
    next(error)
  }
}

const recoverPassword = async (req, res, next) => {
  console.log("body", req.body);
  console.log("payload", req.payload);
  try {
    const password = passwordCompare(
      req.body.password,
      req.payload.password
    )
    if (!password) {
      const hashNewPassword = passwordHash(req.body.password)
      await UsersDaoMongo.updatePassword(
        hashNewPassword,
        req.payload.id
      )

      return res.cookie('token', '', { maxAge: 1 }).status(202).json({
        status: 'Success',
        message: 'Password changed successfully',
      })
    } else {
      res.status(403).json({
        status: 'error',
        message: 'The new password cannot be the same as the old one',
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  register,
  getCurrent,
  forgotPassword,
  redirectRecoverPassword,
  recoverPassword,
}

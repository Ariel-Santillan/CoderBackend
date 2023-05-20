const { generateToken, getUserByToken } = require('../config/jwt')
const { FORGOT_PASSWORD_SUBJECT, COOKIE_USER } = require('../utils/constants')
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
    .cookie(COOKIE_USER, req.user.token, { maxAge: 300000, httpOnly: true })
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
      html: `<a href="http://localhost:8080/recover-password?token=${token}">Reset password</a>`,
    })
    res.json({
      status: 'Success',
      message: 'Recover password email sent',
    })
  } catch (error) {
    return res.send({ status: 'error', message: 'Invalid email' })
  }
}

const recoverPassword = async (req, res, next) => {
  try {
    const newPassword = req.body
    const token = req.params.token

    const user = await getUserByToken(token)
    
        console.log(newPassword);
        console.log(token);
        console.log(user);

    if(!user) {
      return res.status(403).json({
        status: 'Error',
        message: 'Invalid token'
      })
    }

    const passwordMatches = passwordCompare(newPassword, user.password)

    if(passwordMatches){
      return res.status(403).json({
        status: 'Error',
        message: 'New password cannot be the same as the old one'
      })
    }

      const hashNewPassword = passwordHash(newPassword)
      
      await UsersDaoMongo.updatePassword(
        hashNewPassword,
        user.id
      )

      return res.cookie('token', '', { maxAge: 1 }).status(202).json({
        status: 'Success',
        message: 'Password changed successfully',
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  register,
  getCurrent,
  forgotPassword,
  recoverPassword,
}

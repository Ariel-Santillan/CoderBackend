const jwt = require('jsonwebtoken')
const { JWT_PRIVATEKEY } = require('../utils/constants')
const UsersDaoMongo = require('../dao/user.dao')

const generateToken = (payload) => {
  const token = jwt.sign({ payload }, JWT_PRIVATEKEY, { expiresIn: '1h' })
  return token
}

const getPayload = (req, res, next) => {
  const headerAuth = req.headers.authorization

  if (!headerAuth) {
    return res.status(401).send({ error: 'Token was not found' })
  }

  const token = headerAuth.split(' ')[1]
  if (token) {
    jwt.verify(token, JWT_PRIVATEKEY, (e, credential) => {
      console.log(credential)
      if (e) {
        res.status(500).send({ error: 'Unexpected error ', e })
      } else {
        req.payload = credential.payload
        next()
      }
    })
  } else {
    res.status(401).send({ error: 'Token was not found' })
  }
}

const getUserByToken = (token) => {
  return jwt.verify(token, JWT_PRIVATEKEY, async (error, credential) => {
    if (error) {
      return null
    } else {
      const user = await UsersDaoMongo.getById(credential.payload.id)
      return user
    }
  })
}

module.exports = {
  generateToken,
  getPayload,
  getUserByToken,
}

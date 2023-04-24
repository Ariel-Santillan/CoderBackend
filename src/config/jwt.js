const jwt = require('jsonwebtoken')
const { JWT_PRIVATEKEY } = require('../utils/constants')

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
    jwt.verify(token, JWT_PRIVATEKEYY, (e, credential) => {
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

module.exports = {
  generateToken,
  getPayload,
}

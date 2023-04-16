const mdwOnlyAdmin = (req, res, next) => {
  if (!req.session.user.admin) {
    return res.json(401).json({
      status: 'error',
      msg: 'Usuario no autorizado',
    })
  }
  next()
}

const mdwUserSession = (req, res, next) => {
  if (!req.session.user) {
    return res.json(401).json({
      status: 'error',
      msg: 'Usuario no autorizado',
    })
  }
  next()
}

module.exports = { mdwOnlyAdmin, mdwUserSession }

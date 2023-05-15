const errors = require('./EErrors')

const mdwError = (error, req, res, next) => {
  switch (error) {
    case errors.MONGO_ERROR:
      res
        .status(error.code)
        .json({ error: 'Error related to Mongo DB', message: error.message })
      break
    case errors.ARG_INVALID:
      res.status(error.code).json({
        error: 'Error related to invalid args',
        message: error.message,
      })
      break
    case errors.CREATE_PRODUCT:
      res.status(error.code).json({
        error: 'Error when creating a product',
        message: error.message,
      })
      break
    case errors.CREATE_USER:
      res.status(error.code).json({
        error: 'Error when creating a user',
        message: error.message,
      })
      break
    case errors.GET_PRODUCT:
      res.status(error.code).json({
        error: 'Error getting product',
        message: error.message,
      })
      break
    case errors.GET_USER:
      res.status(error.code).json({
        error: 'Error getting user',
        message: error.message,
      })
      break
    case errors.UPDATE_USER:
      res.status(error.code).json({
        error: '',
        message: error.message
      })
    default:
      res.status(500).json({ error: 'Unknown error' })
      break
  }
}

module.exports = { mdwError }

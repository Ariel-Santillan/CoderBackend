class CustomError {
  static createError(code, message, type) {
    const error = new Error(message)
    error.code = code
    error.tpye = type
    throw error
  }
}

module.exports = CustomError

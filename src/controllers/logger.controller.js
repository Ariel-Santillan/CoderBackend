const loggerController = (req, res) => {
  //Cómo meter un service acá?
  const fatal = req.logger.fatal('Fatal error occured')
  const error = req.logger.error('An error has occured')
  const warning = req.logger.warning('Warning with this')
  const info = req.logger.info('Info log to help you')
  const http = req.logger.http('HTTP request')
  const debug = req.logger.debug('You are on debug mode')

  res.json({
    fatal: fatal,
    error: error,
    warning: warning,
    info: info,
    http: http,
    debug: debug
  })
}

module.exports = { loggerController }
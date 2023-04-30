const winston = require('winston')

const CustomWinston = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'red',
    error: 'orange',
    warning: 'yellow',
    info: 'blue',
    debug: 'white',
  },
}

const loggerProd = winston.createLogger({
  levels: CustomWinston.levels,
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize({ colors: CustomWinston.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      level: 'error',
      filename: './errors.log',
      format: winston.format.combine(
        winston.format.colorize({ colors: CustomWinston.colors }),
        winston.format.simple()
      ),
    }),
  ],
})

const loggerDev = winston.createLogger({
  levels: CustomWinston.levels,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ colors: CustomWinston.colors }),
        winston.format.simple()
      ),
    }),
  ],
})

const mdwLogger = (req, res, next) => {
  req.logger = process.env.NODE_ENV ? loggerProd : loggerDev
  req.logger.http(`${req.method} * ${req.url}`)
  next()
}

module.exports = mdwLogger

const dotenv = require('dotenv')

const path = require('path')

const { program } = require('commander')

program.requiredOption('--mode <mode>', 'Server execution mode', 'production')

program.parse()

const ambiente = program.opts().mode

dotenv.config({
  path: path.join(
    __dirname,

    ambiente == 'production'
      ? '/./../../.env.production'
      : '/./../../.env.development'
  ),
})

module.exports = {
  PORT: process.env.PORT,

  MONGO_URL: process.env.MONGO_URL,

  ADMIN_NAME: process.env.ADMIN_NAME,

  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  PERSISTENCE: process.env.PERSISTENCE,
  USERMAILING: process.env.USERMAILING,
  USERPASSWORD: process.env.USERPASSWORD,
}

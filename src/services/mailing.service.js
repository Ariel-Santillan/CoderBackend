const nodemailer = require('nodemailer')
const { USERMAILING, USERPASSWORD } = require('../config/config')

class Mailing {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: USERMAILING,
        pass: USERPASSWORD,
      },
    })
  }

  sendMail = ({ to, subject, html }) => this.transporter.sendMail({ to, subject, html })
}

module.exports = new Mailing()
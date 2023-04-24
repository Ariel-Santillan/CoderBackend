const multer = require('multer')
const { URL_SERVICE } = require('../utils/constants')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/../public/img')
  },
  filename: (req, file, cb) => {
    const nameFile = new Date().getTime() + `-${file.originalname}`
    req.body.thumbnail = `${URL_SERVICEVICE}/img/` + nameFile

    cb(null, nameFile)
  },
})

module.exports = multer({ storage })

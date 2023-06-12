const multer = require('multer')
const { URL_SERVICE } = require('./constants')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let route = 'documents'
    if(file.fieldname == 'thumbnail') route = 'profile'
    if(file.fieldname == 'image') route = 'documents'
    cb(null, __dirname + `/../public/documents/${route}`)
  },
  filename: (req, file, cb) => {
    const nameFile = new Date().getTime() + `-${file.originalname}`
    req.body.thumbnail = `${URL_SERVICE}/img/` + nameFile
    const fileExtension = file.originalname.split('.')

    cb(null, `${nameFile}.${fileExtension[1]}`)
  },
})

module.exports = multer({ storage })

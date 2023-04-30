const { Router } = require('express')
const { loggerController } = require('../controllers/logger.controller')

const router = Router()

router.get('/', loggerController)

module.exports = router

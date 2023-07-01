const { Router } = require('express')
const usersController = require('../controllers/users.controller')
const passportCustom = require('../config/passportCall')
const { STRATEGY_JWT } = require('../utils/constants')
const { saveDocs } = require('../utils/multer.utils')
const { mdwOnlyAdmin } = require('../config/mdws')

const router = Router()

router.get('/premium/:uid', usersController.changePremium)

router.post(
  '/:uid/documents',
  passportCustom(STRATEGY_JWT),
  saveDocs,
  usersController.uploadDocs
)

router.get('/', usersController.getAll)

router.delete('/', passportCustom(STRATEGY_JWT), mdwOnlyAdmin, usersController.deleteAllInactiveUsers)

router.delete('/:uid', usersController.deleteById)

module.exports = router

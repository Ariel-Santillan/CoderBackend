const { Router } = require('express')
const usersController = require('../controllers/users.controller');
const passportCustom = require('../config/passportCall');
const { STRATEGY_JWT } = require('../utils/constants');
const { saveDocs } = require('../utils/multer.utils');

const router = Router()

router.get('/premium/:uid', usersController.changePremium)

router.post('/:uid/documents',passportCustom(STRATEGY_JWT),saveDocs,usersController.uploadDocs);

module.exports = router

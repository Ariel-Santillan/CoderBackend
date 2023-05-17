const { Router } = require('express')
const usersController = require('../controllers/users.controller')

const router = Router()

router.get('/premium/:uid', usersController.changePremium)

module.exports = router

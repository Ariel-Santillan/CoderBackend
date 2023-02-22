const { Router } = require('express')
const usersController = require('../controllers/users.controller')

const router = Router()

router.post('/login', usersController.login)

router.post('/register', usersController.register)

router.get('/logout', usersController.logout)

module.exports = router

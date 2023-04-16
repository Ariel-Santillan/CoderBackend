const { Router } = require('express')
const chatsController = require('../controllers/chats.controller')
const { mdwUserSession } = require('../config/mdws')

const router = Router()

router.get('/', chatsController.getAllMessages)

router.post('/', mdwUserSession, chatsController.addNewMessage)

module.exports = router

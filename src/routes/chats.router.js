const { Router } = require('express')
const chatsController = require('../controllers/chats.controller')

const router = Router()

router.get('/', chatsController.getAllMessages)

router.post('/', chatsController.addNewMessage)

module.exports = router

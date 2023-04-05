const chatsService = require('../services/chat.service')
const { edmitAddMessage } = require('../config/socket.io')

const getAllMessages = async (req, res) => {
  try {
    const messages = await chatsService.getAllMessages()
    return res.json({
      msg: 'OK',
      payload: messages,
    })
  } catch (error) {
    return res.status(500).json({
      msg: 'Error',
      payload: 'Error al intentar obtener los mensajes',
    })
  }
}

const addNewMessage = async (req, res) => {
  try {
    const newMessage = req.body
    const messageAdded = await chatsService.addNewMessage(newMessage)
    edmitAddMessage(messageAdded)
    return res.json({
      msg: 'OK',
      payload: messageAdded,
    })
  } catch (error) {
    return res.status(500).json({
      msg: 'Error',
      payload: 'Error al intentar agregar el mensaje',
    })
  }
}

module.exports = { getAllMessages, addNewMessage }

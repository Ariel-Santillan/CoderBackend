const ChatsManagerMongo = require('../dao/MongoManager/chatsManagerMongo')
const { edmitAddMessage } = require('../utils/socket.io')

const getAllMessages = async (req, res) => {
  try {
    const messages = await ChatsManagerMongo.getMessages()
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
    const messageAdded = await ChatsManagerMongo.addMessage(newMessage)
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

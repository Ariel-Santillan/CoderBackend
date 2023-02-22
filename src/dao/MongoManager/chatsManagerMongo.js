const MessagesModel = require('../models/messages.model')

class ChatsManagerMongo {
  getMessages = async () => {
    return await MessagesModel.find()
  }

  addMessage = async (newMessage) => {
    return await MessagesModel.create(newMessage)
  }
}

module.exports = new ChatsManagerMongo()

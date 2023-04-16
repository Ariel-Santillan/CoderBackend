const MessagesModel = require('./models/messages.model')

class ChatsDaoMongo {
  get = () => MessagesModel.find()

  insert = (chat) => MessagesModel.create(chat)
}

module.exports = new ChatsDaoMongo()

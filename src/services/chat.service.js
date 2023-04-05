const chatsManagerMongo = require('../dao/MongoManager/chatsManagerMongo')

const getAllMessages = async () => await chatsManagerMongo.getMessages()

const addNewMessage = async (newMessage) => await ChatsManagerMongo.addMessage(newMessage)

module.exports = { getAllMessages, addNewMessage }

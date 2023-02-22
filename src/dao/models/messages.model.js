const mongoose = require('mongoose')

const messagesCollection = 'messages'

const messagesSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    required: true,
    type: String,
  },
})

const MessagesModel = mongoose.model(messagesCollection, messagesSchema)

module.exports = MessagesModel

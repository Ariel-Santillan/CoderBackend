const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const ticketsCollection = 'Tickets'

const ticketsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now(),
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
})

const TicketsModel = mongoose.model(ticketsCollection, ticketsSchema)

module.exports = TicketsModel

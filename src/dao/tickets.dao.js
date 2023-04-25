const TicketsModel = require('./models/tickets.model')

class TicketsDaoMongo {
  insert = (cart) => TicketsModel.create(cart)
}

module.exports = new TicketsDaoMongo()

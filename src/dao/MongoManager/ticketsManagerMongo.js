const TicketsModel = require("../models/tickets.model")

class TicketsManagerMongo {
  create = async (ticket) => {
    return await TicketsModel.create({ ticket })
  }
}

module.exports = new TicketsManagerMongo()
class TicketService {
  constructor(dao) {
    this.dao = dao
  }

  insert = (cart) => this.dao.insert(cart)
}

module.exports = TicketService

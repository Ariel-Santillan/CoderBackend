class SessionService {
  constructor(dao) {
    this.dao = dao
  }

  getByEmail = async (email) => this.dao.getByEmail(email)

}

module.exports = SessionService

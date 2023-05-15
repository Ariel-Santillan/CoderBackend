class SessionService {
  constructor(dao) {
    this.dao = dao
  }

  getByEmail = (email) => this.dao.getById({email: email})

}

module.exports = SessionService

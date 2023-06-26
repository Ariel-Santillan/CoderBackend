class UserService {
  constructor(dao) {
    this.dao = dao
  }

  login = async (email, password) => this.dao.login(email, password)

  register = async (user) => this.dao.register(user)

  getByID = async (id) => this.dao.getByID(id)

  insert = (cart) => this.dao.insert(cart)

  getByEmail = (email) => this.dao.getByEmail(email)

  updateLastConnection = (id, user) => this.dao.updateById(user, id)

  updateUserDoc = (id, docs) => this.dao.updatedocs(id, docs)

  getAll = async () => this.dao.getAll()

  deletedByID = async (id) => this.dao.deletedByID(id)
}

module.exports = UserService

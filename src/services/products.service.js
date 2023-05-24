class ProductService {
  constructor(dao) {
    this.dao = dao
  }

  get = () => this.dao.get()

  getById = (id) => this.dao.getById(id)

  insert = (product) => this.dao.insert(product)

  updateById = (product, id) => this.dao.updateById(product, id)

  deleteByID = (id) => this.dao.deleteByID(id)

  getAllProductsByIDs = (ids) => this.dao.getAllProductsByIDs(ids)
}

module.exports = ProductService

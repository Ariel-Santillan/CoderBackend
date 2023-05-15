class CartService {
  constructor(dao) {
    this.dao = dao
  }

  get = () => this.dao.get()
  
  getById = (id) => this.dao.getById(id)
  
  insert = (cart) => this.dao.insert(cart)
  
  updateById = (cart, id) => this.dao.updateById(cart, id)
  
  deleteByID = (id) => this.dao.deleteByID(id)
}



module.exports = CartService

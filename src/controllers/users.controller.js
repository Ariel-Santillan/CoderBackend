const UsersManagerMongo = require('../dao/MongoManager/usersManagerMongo')

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
      req.session.admin = true
      let user = {
        firstName: 'Coder',
        lastName: 'Coder',
        age: 20,
        email: email,
      }
      req.session.user = user
      res.send(user)
    } else{
      user = await UsersManagerMongo.login(email, password)
      console.log(user);
      if (user) {
        req.session.user = user
        res.send({
          firstName: req.session.user.firstName,
          lastName: req.session.user.lastName,
          age: req.session.user.age,
          email: req.session.user.email,
        })
      }
    }
  } catch (error) {
    return res.status(401).json({
      status: 'Error',
      payload: 'Email o contraseña incorrectos',
    })
  }
}

const register = async (req, res) => {
  try {
    const user = req.body
    const userCreated = await UsersManagerMongo.register(user)
    res.send(userCreated)
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      payload: 'Error al crear usuario',
    })
  }
}

const logout = async (req, res) => {
try {
  req.session.destroy(err => {
    if(!err) res.send('Logout exitoso')
    else res.status(500).json({
      status: 'Error',
      payload: 'Error al desloguearse',
    })
  })
} catch (error) {
  
}
}

module.exports = { login , register, logout}

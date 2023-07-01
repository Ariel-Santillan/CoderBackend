const {
  ADMIN_NAME,
  ADMIN_PASSWORD,
  DELETE_ACCOUNT_SUBJECT,
} = require('../config/config')
const UserDTO = require('../dao/DTOs/user.dto')
const { userService } = require('../services')
const mailingService = require('../services/mailing.service')

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email === ADMIN_NAME && password === ADMIN_PASSWORD) {
      req.session.admin = true
      let user = {
        firstName: 'Coder',
        lastName: 'Coder',
        age: 20,
        email: email,
      }
      req.session.user = user
      res.send(user)
    } else {
      user = await userService.login(email, password)
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
    const userDTO = new UserDTO(user)
    const userCreated = await userService.register(userDTO)
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
    req.session.destroy((err) => {
      if (!err) res.send('Logout exitoso')
      else
        res.status(500).json({
          status: 'Error',
          payload: 'Error al desloguearse',
        })
    })
  } catch (error) {}
}

const changePremium = async (req, res) => {
  const user = req.session.user
  const role = user.role
  if (role == 'premium') {
    user.role = 'user'
  } else if (role == 'user') {
    user.role = 'premium'
  }
  return (req.session.user = user)
}

const uploadDocs = async (req, res) => {
  try {
    const { user } = req.user

    let userDocuments = []
    user.documents.forEach((element) => {
      userDocuments.push(element.name)
    })
    await userService.updateUserDoc(user.id, {
      documents: [
        ...user.documents,
        {
          name: req.body.typeDocument,
          reference: req.route,
        },
      ],
    })
    res.send({ status: 'sucsses', msg: 'File/s successfully saved' })
  } catch (error) {
    res.send({ status: 'error', msg: error.message })
  }
}

const getAll = async (req, res) => {
  try {
    const allUsers = await userService.getAll()
    const allUsersPrimaryData = allUsers.map((user) => ({
      name: user.name,
      lastname: user.lastName,
      mail: user.email,
      role: user.role,
    }))
    res.send({ status: 'success', msg: allUsersPrimaryData })
  } catch (error) {
    res.send({ status: 'error', msg: error.message })
  }
}

const deleteAllInactiveUsers = async (req, res) => {
  try {
    const usersDeleted = []
    const allUsers = await userService.getAll()

    //Filter users to delete and send email
    allUsers.forEach((user) => {
      const today = new Date()
      const expirationDate = today.setDate(today.getDate() - 2)
      const diff = expirationDate < today
      if (diff) {
        mailingService.sendMail({
          to: user.email,
          subject: DELETE_ACCOUNT_SUBJECT,
          html: `Hi ${user.name}, your account has been deleted due to 2 days of inactivity`,
        })
        usersDeleted.push(user.id)
      }
    })

    //Delete filtered users
    usersDeleted.forEach(async (id) => {
      await userService.deletedByID(id)
    })
    return res.json({
      status: 'Success',
      message: `${usersDeleted.length} users were deleted`,
    })
  } catch (error) {
    return res.json({
      status: 'Error',
      message: error.message,
    })
  }
}

const deleteById = async (req, res) => {
  try {
    const userID = req.params.uid
    const deleted = await userService.deletedByID
    return res.json({
      status: 'Success',
      payload: 'User sucessfully deleted',
    })
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      payload: error.message,
    })
  }
}

module.exports = {
  login,
  register,
  logout,
  changePremium,
  uploadDocs,
  getAll,
  deleteAllInactiveUsers,
  deleteById,
}

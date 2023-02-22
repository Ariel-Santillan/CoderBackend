const express = require('express')
const cartsRouter = require('./routes/carts.router')
const productRouter = require('./routes/products.router')
const viewsRouter = require('./routes/views.router')
const chatsRouter = require('./routes/chats.router')
const handlebars = require('express-handlebars')
const { connectSocket } = require('./utils/socket.io')
const mongoose = require('mongoose')
const PORT = 8080
const server = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const connectMongo = require('connect-mongo')
const sessionRouter = require('./routes/session.router')

//Express
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

//Handlebars
server.engine('handlebars', handlebars.engine())
server.set('views', __dirname + '/views')
server.set('view engine', 'handlebars')
server.use(express.static(__dirname + '/public'))

//Cookies
server.use(cookieParser())

//Sessions. MUST be before Routes, this is just how express-session works. If moved down, req.session = undefined
server.use(
  session({
    store: connectMongo.create({
      mongoUrl:
        'mongodb+srv://CoderUser:CoderPass@codercluster.5ssvndd.mongodb.net/?retryWrites=true&w=majority',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 30,
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)

//Routes
server.use('/api/products', productRouter)
server.use('/api/carts', cartsRouter)
server.use('/api/chats', chatsRouter)
server.use('/', viewsRouter)
// server.use('/api/sessions', viewsRouter)
server.use('/api/sessions', sessionRouter)

//Socket io
const httpServer = server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

connectSocket(httpServer)

//Mongoose
mongoose.set('strictQuery', false)
mongoose.connect(
  'mongodb+srv://CoderUser:CoderPass@codercluster.5ssvndd.mongodb.net/?retryWrites=true&w=majority',
  // { useNewUrlParser: true, saveUninitialized: true },
  (error) => {
    if (error) {
      console.log('Error de conexión. ', error)
      process.exit()
    } else {
      console.log('Conexión con la base de datos exitosa')
    }
  }
)

const express = require('express')
const cartsRouter = require('./routes/carts.router')
const productRouter = require('./routes/products.router')
const viewsRouter = require('./routes/views.router')
const chatsRouter = require('./routes/chats.router')
const handlebars = require('express-handlebars')
const { connectSocket } = require('./config/socket.io')
const mongoose = require('mongoose')
const server = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const connectMongo = require('connect-mongo')
const sessionRouter = require('./routes/session.router')
const { InitPassport } = require('./config/passport.config')
const passport = require('passport')
const { MONGO_URL, PORT } = require('./config/config')
const { mdwError } = require('./utils/errorHandler')
const mdwLogger = require('./utils/logger')
const loggerRouter = require('./routes/logger.router')
const usersRouter = require('./routes/users.router')

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
      mongoUrl: MONGO_URL,
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

//Passport
InitPassport()
server.use(passport.initialize())
server.use(passport.session())

//Routes
server.use(mdwLogger)
server.use(mdwError)
server.use('/api/products', productRouter)
server.use('/api/carts', cartsRouter)
server.use('/api/chats', chatsRouter)
server.use('/', viewsRouter)
server.use('/api/sessions', sessionRouter)
server.use('/loggerTest', loggerRouter)
server.use('/api/users', usersRouter)

//Socket io
const httpServer = server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

connectSocket(httpServer)

//Mongoose
mongoose.set('strictQuery', false)
mongoose.connect(MONGO_URL, (error) => {
  if (error) {
    console.log('Error de conexión. ', error)
    process.exit()
  } else {
    console.log('Conexión con la base de datos exitosa')
  }
})

require('dotenv').config()

const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const socketioJwt = require('socketio-jwt')

const authRouter = require('./router/auth')
const loginRouter = require('./router/login')
const roomsRouter = require('./router/room')
const profileRouter = require('./router/profile')
const mainRouter = require('./router/main')
const chatConnect = require('./router/chat')

const app = express()
const server = http.Server(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000

app.set('trust proxy')

// io.use(socketioJwt.authorize({
//   secret: process.env.SECRET,
//   handshake: true
// }))

// io.use((socket, next) => {
//   if (socket.decoded_token.id) {
//     next()
//   } else {
//     next(new Error('Authentication Error'))
//   }
// })

chatConnect(io)

app.use('/auth', authRouter)
app.use('/login', loginRouter)
app.use('/api/chat-rooms', roomsRouter)
app.use('/profile', profileRouter)
app.use('/main', mainRouter)

// 서버 테스트
app.use('/test', function(req, res) { return res.send({ alive: true }) })

server.listen(PORT, () => {
  console.log(`Able to connect to ${PORT}`)
})

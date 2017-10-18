require('dotenv').config()

const express = require('express')
const authRouter = require('./router/auth')
const loginRouter = require('./router/login')
const roomsRouter = require('./router/room')
const profileRouter = require('./router/profile')
const mainRouter = require('./router/main')

const app = express()

const PORT = process.env.PORT || 3000

app.set('trust proxy')

app.use('/auth', authRouter)
app.use('/login', loginRouter)
app.use('/api/chat-rooms', roomsRouter)
app.use('/profile', profileRouter)
app.use('/main', mainRouter)

// 서버 테스트
app.use('/test', function(req, res) { return res.send({ alive: true }) })

app.listen(PORT, () => {
  console.log(`Able to connect to ${PORT}`)
})

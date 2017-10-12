require('dotenv').config()  

const express = require('express')
const authRouter = require('./router/auth')
const loginRouter = require('./router/login')

const app = express()

const PORT = process.env.PORT || 3000

app.set('trust proxy')

app.use('/auth', authRouter)
app.use('/login', loginRouter)

app.listen(PORT, () => {
  console.log(`Able to connect to ${PORT}`)
})
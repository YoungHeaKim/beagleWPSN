require('dotenv').config()  

const express = require('express')
const authRouter = require('./router/auth')
const loginRouter = require('./router/login')

const app = express()

const PORT = process.env.PORT || 3000

const authRouter = require('./router/auth')

app.use(bodyParser.json())
app.use(authRouter)
app.post('/user', (req, res) => {
  res.send({
    token:jwtToken
  })
})

app.listen(PORT, () => {
  console.log(`Able to connect to ${PORT}`)
})
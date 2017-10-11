const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const query = require('./query.js')

const app = express()

app.use(bodyParser, json())

app.post('/user', (req, res) => {
  res.send({
    token:jwtToken
  })
})
app.listen(3000, () => {
  console.log('listening...')
})

// 파일 불러오기
const query = require('./query')

const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
// express
const app = express()
// 포트 설정
const PORT = process.env.PORT || 3000

const authRouter = require('./router/auth')

app.use(bodyParser.json())
app.use(authRouter)
app.post('/user', (req, res) => {
  res.send({
    token:jwtToken
  })
})

// 서버 실행 확인
app.listen(PORT, () => {
  console.log(`listening ${PORT}...`)
})

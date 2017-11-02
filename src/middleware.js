const expressJwt = require('express-jwt')
const cors = require('cors')
const bodyParser = require('body-parser')

const corsMiddleware = cors({
  origin: process.env.TARGET_ORIGIN
})

const jwtMiddleware = expressJwt({
  secret: process.env.SECRET
})

const bodyParserJsonMiddleware = bodyParser.json()

const bodyParserUrlEncodedMiddleware = bodyParser.urlencoded({ extended: false })

const loginRequired = (req, res, next) => {
  if(!req.user.id) {
    res.redirect('/')
  }
   next()
}

module.exports = {
  corsMiddleware,
  jwtMiddleware,
  bodyParserJsonMiddleware,
  bodyParserUrlEncodedMiddleware,
  loginRequired
}
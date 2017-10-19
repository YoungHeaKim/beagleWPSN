const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const {getUserById} = require('../authquery')
const {getRoomById} = require('../chatquery')
const query = require('../profilequery')

const router = express.Router()

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({ extended: false }))

// cors오류 문제 해결해주는 코드
router.use(cors({
  origin: process.env.TARGET_ORIGIN
}))

// 로그인이 되어있는 유저 정보를 가져와야한다.
// 로그인이 되어있는 유저가 들어가있는 방 정보를 가져온다.
router.get('/', (req, res, next) => {
  // 자기 자신의 프로필을 가져온다.
  const user = getUserById(req.user.id)
  // 여러개의 대화방을 가져올 수 있는 대화방 쿼리를 짜주어야한다.
  const room = getRoomById()
    .then(
      if(creater) {

      } else {

      }
    )
  Promise.all([user, room])
    .then()
})



module.exports = router

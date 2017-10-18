const express = require('express')
const bodyParser = require('body-parser')

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
  const user = getUserById(req.params.id)
    .then(user => {
      if(user) {
        res.json(user)
      } else {
        res.status(404).send('User로그인 정보가 다릅니다.')
      }
    })
  const room = getRoomById(req.params.id)
    .then(room => {
      if (room) {
        res.json(room)
      } else {
        res.status(404).send('Room Not Found')
      }
    })
  Promise.all([user, room])
    .then
})



module.exports = router

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const {getUserById} = require('../authquery')
const {getRoomsById, checkCreatorById, deleteRoom, modifyUserInfoById} = require('../profilequery')

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
  const currentUser = req.user.id
  // 자기 자신의 프로필을 가져온다.
  const user = getUserById(currentUser)
  console.log(user);
  // 여러개의 대화방을 가져올 수 있는 대화방 쿼리를 짜주어야한다.
  const room = getRoomsById(currentUser)
  console.log(room);
    .then(rooms => {
      checkCreatorById(rooms)
    })

  Promise.all([user, room])
    .then(result => {
      res.json(result)
    })
})

// 대화방 삭제
router.delete('/', (req, res, next) => {
  // 지웠을 경우 어떻게 처리할 것인지.
})

module.exports = router

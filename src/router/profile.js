const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const expressJwt = require('express-jwt')

const {getUserById} = require('../authquery')
const {getRoomsById, checkCreatorById, deleteRoom, modifyUserInfoById} = require('../profilequery')

const router = express.Router()

router.use(expressJwt({
  secret: process.env.SECRET
}))
router.use(bodyParser.json())

router.use(bodyParser.urlencoded({ extended: false }))

// cors오류 문제 해결해주는 코드
router.use(cors({
  origin: process.env.TARGET_ORIGIN
}))

// 로그인이 되어있는 유저 정보를 가져와야한다.
// 로그인이 되어있는 유저가 들어가있는 방 정보를 가져온다.
router.get('/',(req, res, next) => {
  const currentUser = parseInt(req.query.id)
  // 해당방의 참여하고 있는 사람들의 프로필 사진만 보내주면 된다.
  const userInfo = getUserById(currentUser)

  // 여러개의 대화방을 가져올 수 있는 대화방 쿼리를 짜주어야한다.
  const roomInfo = getRoomsById(currentUser)
    .then(rooms => {
      return checkCreatorById(rooms, currentUser)
    })

  Promise.all([userInfo, roomInfo])
    .then(result => {
      res.json(result)
    })
})

// user의 nickname을 수정하는 부분
router.get('/nickname', (req, res, next) => {
  const nickname = req.query.nickname
  const user_id = req.query.user_id
  modifyUserInfoById(user_id, nickname)
    .then(result => {
      res.json(result)
    })
})

// 대화방 삭제
router.delete('/delete', (req, res, next) => {
  // 지웠을 경우 어떻게 처리할 것인지.
  // 삭제할 권한이 있는지 없는지 비교하는 부분
  const id = req.params.id
  const creator = req.user.id
  deleteRoom(id, creator)
    .then(() => {
      if(creator) {
        console.log('success')
        next()
      } else {
        throw new Error('삭제할 권한이 없습니다.')
      }
    })
  .then(result => {
    res.json(result)
  })
})

module.exports = router

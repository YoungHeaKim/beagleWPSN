const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const expressJwt = require('express-jwt')

const { getRoomsById, checkCreatorById, exitRoom, modifyUserInfoById, findNextCreator, deleteRoom, updateCreator, selectUserByRoom, selectCreator, getUserProfilePhotoByRoom } = require('../profilequery')
const {getUserById} = require('../authquery')

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
router.get('/', (req, res, next) => {
  const currentUser = parseInt(req.query.id)

  // 해당방의 참여하고 있는 사람들의 프로필 사진만 보내주면 된다.
  const userInfo = getUserById(currentUser)

  // 여러개의 대화방을 가져올 수 있는 대화방 쿼리를 짜주어야한다.
  const roomInfo = getRoomsById(currentUser)
    // .then(chatRooms => {
    //   // find 안에 id와 chat_room.id가 같으면 true
    //   const chatRoomId = chatRooms.filter(id => id === id )
    //   console.log(chatRoomId)
    //   const chatRoom = chatRoomId.id
    //   console.log(chatRoom)
    //   return getUserProfilePhotoByRoom(chatRoom)
    // })
    .then(rooms => {
      return checkCreatorById(rooms, currentUser)
    })

  Promise.all([userInfo, roomInfo])
    .then(result => {
      res.send(result)
    })
})

// user의 nickname을 수정하는 부분
router.get('/nickname', (req, res, next) => {
  const nickname = req.body.nickname
  const user_id = req.user.id
  modifyUserInfoById(user_id, nickname)
    .then(result => {
      res.send({
        id: user_id,
        nickname: nickname
      })
    })
})

// 삭제 부분
router.delete('/delete/:room_id', (req, res) => {
  const user_id = req.user.id
  const chat_room_id = req.params.room_id
  selectUserByRoom(chat_room_id)
    .then(result => {
        if (result.length > 1 && user_id != result[0].creator) {
          // 해당 방의 참여 유저가 1명이상일 때와 로그인한 유저가 방장이 아닐때 그냥 방을 나가는 부분
          exitRoom(user_id, chat_room_id)
            .then(result => {
              res.send({id: chat_room_id })
            })
        } else if(result.length > 1 && user_id == result[0].creator ) {
          // 해당유저가 채팅방이 나갈 경우 creator를 다른유저에게 넘겨주는 부분
          exitRoom(user_id, chat_room_id)
            .then(() => {
              findNextCreator({ chat_room_id, user_id })
                .then(result => {
                  const resultUser = result.user_id
                  updateCreator(user_id, resultUser)
                  .then(result => {
                    res.send({ id: chat_room_id })
                  })
                })
            })
        } else {
          deleteRoom(chat_room_id)
            .then(result => {
              res.send({ id: chat_room_id })
            })
        }
    })
})
module.exports = router

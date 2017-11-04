const express = require('express')
const cors = require('cors')

const mw = require('../middleware')

const query = require('../profilequery')
const {getUserById} = require('../authquery')

const router = express.Router()

router.options('*', cors())

router.use(mw.jwtMiddleware)
router.use(mw.corsMiddleware)
router.use(mw.bodyParserJsonMiddleware)
router.use(mw.bodyParserUrlEncodedMiddleware)

// 로그인이 되어있는 유저 정보를 가져와야한다.
// 로그인이 되어있는 유저가 들어가있는 방 정보를 가져온다.
router.get('/', (req, res, next) => {
  const currentUser = parseInt(req.query.id)

  // 해당방의 참여하고 있는 사람들의 프로필 사진만 보내주면 된다.
  const userInfo = getUserById(currentUser)

  // 여러개의 대화방을 가져올 수 있는 대화방 쿼리를 짜주어야한다.
  const roomInfo = query.getRoomsById(currentUser)
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
  query.modifyUserInfoById(user_id, nickname)
    .then(result => {
      res.send({
        id: user_id,
        nickname: nickname
      })
    })
})

// 임시로 놔둠
router.get('/rooms', (req, res) => {
  query.getRoomsByUserId(req.user.id)
    .then(result => {
      res.json(result)
    })
})

// 삭제 부분
router.delete('/delete/:room_id', (req, res) => {
  const user_id = req.user.id
  const chat_room_id = req.params.room_id
  query.selectUserByRoom(chat_room_id)
    .then(result => {
        if (result.length > 1 && user_id != result[0].creator) {
          // 해당 방의 참여 유저가 1명이상일 때와 로그인한 유저가 방장이 아닐때 그냥 방을 나가는 부분
          query.exitRoom(user_id, chat_room_id)
            .then(result => {
              res.send({id: chat_room_id })
            })
        } else if(result.length > 1 && user_id == result[0].creator ) {
          // 해당유저가 채팅방이 나갈 경우 creator를 다른유저에게 넘겨주는 부분
          query.exitRoom(user_id, chat_room_id)
            .then(() => {
              query.findNextCreator({ chat_room_id, user_id })
                .then(result => {
                  const resultUser = result.user_id
                  query.updateCreator(user_id, resultUser)
                  .then(result => {
                    res.send({ id: chat_room_id })
                  })
                })
            })
        } else {
          query.deleteRoom(chat_room_id)
            .then(result => {
              res.send({ id: chat_room_id })
            })
        }
    })
})

router.delete('/chatList/:id', (req, res) => {
  const userId = req.user.id
  const chatRoomId = parseInt(req.params.id)
  // id가 숫자가 아닐 경우 
  if(isNaN(chatRoomId)) {
    return res.status(400).send('Bad Request')
  }

  query.exitRoom(userId, chatRoomId)
    .then(result => {
      res.json({id: chatRoomId})
    })
    .catch(e => {
      res.status(404).send(e.message)
    })
  
})

router.delete('/chatRooms/:id', (req, res) => {
  const chatRoomId = parseInt(req.params.id)
  // id가 숫자가 아닐 경우 
  if(isNaN(chatRoomId)) {
    return res.status(400).send('Bad Request')
  }

  query.getARoomByRoomId(chatRoomId)
    .then(room => {
      
      // room이 undefined일 경우 
      if(!room) {
        return res.status(404).send('Not Found')
      }
      // creator가 아닐경우 권한이 없음을 표시
      if(room.creator !== req.user.id) {
        return res.status(403).send('Forbidden')
      }

      return query.deleteRoom(room.id)
    })
    .then(result => {
      res.json({id: chatRoomId})
    })
})

module.exports = router

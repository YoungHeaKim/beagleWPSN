const express = require('express')
const expressJwt = require('express-jwt')
const cors = require('cors')
const bodyParser = require('body-parser')

// 기능별로 나눌것 

const {createLog, createRoom, findOrCreateChatList, findRoomsIdByUserId ,getRoomById, getRoomInfoById} = require('../chatquery')

const router = express.Router()

router.options('*', cors())

router.use(expressJwt({
  secret: process.env.SECRET
}))

// JWT 토큰 확인 - 경로 진입시
router.use((req, res, next) => {
  console.log(req.user.id)
  if(!req.user.id) {
    res.redirect('/')
  }
   next()
})

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({ extended: false }))

router.use(cors({
  origin: process.env.TARGET_ORIGIN
}))

// 룸을 생성하는 것
// 
router.post('/', (req, res) => {
  createRoom(req.body)
    .then(roomId => {
      if (roomId) {
        res.json(roomId)
        // getRoomInfoById({chat_room_id: room.id})
        //   .then(info => {
        //     res.json(info)
        //   })
      } else {
        res.status(404).send('Room Not Found')
      }
    })
})

router.get('/ids', (req, res) => {
  findRoomsIdByUserId(req.user.id)
    .then(ids => {
      res.json(ids)
    })
    .catch(e => res.status(404).send('Room Ids Not Found'))
})

router.get('/:id', (req, res) => {
  findOrCreateChatList({chat_room_id: req.params.id, user_id: req.user.id})
    .then(() =>{
      getRoomById(req.params.id)
      .then(room => {
        if (room) {
          getRoomInfoById({chat_room_id: room.id})
            .then(info => {
              res.json(info)
            })
        } else {
          res.status(404).send('Room Not Found')
        }
      })
    })
})

module.exports = router
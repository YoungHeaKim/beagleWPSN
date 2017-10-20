const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')

const {createLog, createRoom, getRoomById, getRoomInfoById} = require('../chatquery')

const router = express.Router()

// JWT 토큰 확인 - 경로 진입시
// router.use((req, res, next) => {
//   if(!req.data.token) {
//     res.redirect('/')
//   }
//    next()
// })

// 토큰이 있으면 진입을 허용하고 아니면 허용하지 않는다. 토큰이 잘 넘어온다고 가정한다.
// router.get('/', (req, res) => {
//   getAllRooms()
//     .then(rooms => {
      
//     })
// })
router.use(bodyParser.json())

router.use(bodyParser.urlencoded({ extended: false }))

router.use(cors({
  origin: process.env.TARGET_ORIGIN
}))

router.post('/', (req, res) => {

  createRoom(req.body)
    .then(room => {
      console.log(room)
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

router.get('/:id', (req, res, next) => {
  // 룸 보내줄때 방장정보, 참여한 사람정보(우선한다), 채팅로그도 보내줘야 합니다. 추가할 것! 
  // 또 방장로직뿐만 아니라 방장이 아닌 사람이 채팅방을 클릭했을때 채팅방리스트에 연결해줘야해여(find or create)

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

// 새로운 로그생성 
router.post('/:id', (req, res, next) => {
  const chat_room_id = req.body.id
  const user_id = req.body.user_id
  const message = req.body.message
  
  createLog({message, user_id, chat_room_id})
    .then(log => {
      if (log === []) {
        res.status(404).send('Log failed...')
      } else {
        res.send({ok: true})
      }
    })
})

module.exports = router
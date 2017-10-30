const express = require('express')
const expressJwt = require('express-jwt')
const cors = require('cors')
const bodyParser = require('body-parser')

// 기능별로 나눌것
const {createLog, createRoom, findOrCreateChatList, findRoomsIdByUserId ,getRoomById, getRoomInfoById} = require('../chatquery')

// mainquery 호출
const query = require('../mainquery')

const router = express.Router()

router.options('*', cors())

router.use(cors({
  origin: process.env.TARGET_ORIGIN
}))

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

// 기본 페이지 리스트 및 필터링에 대한 요청이 들어오게 되면 필터링 된 결과 값을 보내준다.
router.get('/', (req, res) => {
  let id, like

  if('like' === req.query.sort){
    like = req.query.sort
    id = null
  }else if('latest' === req.query.sort){
    like = null
    id = req.query.sort
  }

  let data = {
    city_id: req.query.city_id,
    start_at: req.query.start_at,
    like: like,
    id: id,
    lastLike: req.query.lastLike,
    lastId: req.query.lastId
  }
  query.getAllData(data)
    .limit(6)
    .then(list => res.send(list))
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

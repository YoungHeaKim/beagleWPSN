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

const jwtMiddleware = expressJwt({
  secret: process.env.SECRET
})

// JWT 토큰 확인 - 경로 진입시
// router.use((req, res, next) => {
//   if(!req.user.id) {
//     res.redirect('/')
//   }
//    next()
// })

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({ extended: false }))

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

// 룸 생성
router.post('/', jwtMiddleware, (req, res) => {
  const {name, description, start_at, photo, creator, city_id} = req.body

  // 필수조건이 하나라도 만족되지 않았을 경우 400 리턴 
  if(!name || !description || !start_at || !creator || !city_id) {
    return res.status(400).send('Bad Request')
  }

  createRoom(req.body)
    .then(roomId => {
      if (roomId) {
        res.json(roomId)
      } else {
        // 타입에러? 
        res.status(400).send('Bad Request')
      }
    })
})

router.get('/ids', jwtMiddleware, (req, res) => {
  findRoomsIdByUserId(req.user.id)
    .then(ids => {
      res.json(ids)
    })
    .catch(e => res.status(404).send('Room Ids Not Found'))
})

router.get('/:id', jwtMiddleware, (req, res) => {
  const chat_room_id = req.params.id
  const user_id = req.user.id

  // chat_room_id가 숫자가 아닐경우 400 리턴
  // if(typeof chat_room_id !== 'number') {
  //   return res.status(400).send('Bad Request')
  // }

  findOrCreateChatList({chat_room_id, user_id})
    .then(() =>{
      getRoomById(user_id)
      .then(room => {
        if (room) {
          getRoomInfoById({chat_room_id: room.id})
            .then(info => {
              res.json(info)
            })
        } else {
          // 요청하는 방이 존재하지 않을 경우 404 리턴 
          res.status(404).send('Room Not Found')
        }
      })
    })
})

module.exports = router

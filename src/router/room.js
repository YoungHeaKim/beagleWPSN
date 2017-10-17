const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const {getAllRooms, createRoom, getRoomById} = require('../chatquery')

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
  console.log(req.body)

  createRoom(req.body)
    .then(room => {
      res.json(room)
    })
})

router.get('/:id', (req, res, next) => {
  console.log(req.params.id)

  getRoomById(req.params.id)
    .then(room => {
      if (room) {
        res.json(room)
      } else {
        res.status(404).send('Room Not Found')
      }
    })
})

module.exports = router
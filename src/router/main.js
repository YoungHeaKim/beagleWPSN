const query = require('../mainquery')
const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

// index page를 켰을때, 모든 RoomList를 전송한다.
router.post('/', (req, res) => {
  res.send(query.getAllRoomList())
})

// 필터링에 대한 요청이 들어오게 되면 필터링 된 결과 값을 보내준다.
router.get('/', (req, res, next) => {
  query.getDataRoomList({
    city_id: req.query.city_id,
    start_at: req.query.start_at,
    like: req.query.like,
    id: req.query.id
  }).then(list => {
    res.send(list)
  }).catch(err => {
    done(err)
  })
})

module.exports = router

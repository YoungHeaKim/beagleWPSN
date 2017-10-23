const query = require('../mainquery')
const express = require('express')
const cors = require('cors')

const router = express.Router()

router.use(cors({
  origin: process.env.TARGET_ORIGIN
}))

// index page를 켰을때, 모든 RoomList를 전송한다.
router.get('/', (req, res) => {
  query.getAllRoomList()
    .then(list => res.json(list))
})

// 필터링에 대한 요청이 들어오게 되면 필터링 된 결과 값을 보내준다.
router.get('/:filter', (req, res) => {
  if(req.params.filter){
    let id,
        like
    if('like' === req.query.sort){
      like = req.query.sort
      id = null
    }else if('latest' === req.query.sort){
      like = null
      id = req.query.sort
    }
    const data = {
      city_id: req.query.city_id,
      start_at: req.query.start_at,
      id: id,
      like: like
    }
    query.getDataRoomList(data).then(
      list => res.json(list))
  }
})

module.exports = router

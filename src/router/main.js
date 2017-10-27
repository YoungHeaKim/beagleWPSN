const query = require('../mainquery')
const express = require('express')
const cors = require('cors')


const router = express.Router()

router.use(cors({
  origin: process.env.TARGET_ORIGIN
}))

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
  query.getIdLikeData(data)
    .limit(6)
    .then(list => res.send(list))
})

module.exports = router

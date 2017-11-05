const express = require('express')
const cors = require('cors')

const mw = require('../middleware')

// 파일 불러오기
const query = require('../query')

// express를 router로 실행한다.
const router = express.Router()

// cors에 unsafe요청이 있을시 통과시켜주는 부분이다.
router.options('*', cors())

/**
 * bodyParser에서 json파일을 실행한다.
 */
router.use(mw.bodyParserJsonMiddleware)

/**
 * expressJwt는 프론트쪽으로 token을 넘겼다는 것을 확인하는 부분이다.
 */
router.use(mw.jwtMiddleware)

/**
 * cors를 사용하여 다른 곳에서 유저에관하여 삭제,변경 등을 하지 못하게 하여 target_origin을 정해놓고 거기안에서만의 요청을 만드는 코드
 */
router.use(mw.corsMiddleware)

router.get('/', (req, res) => {
  query.getUserById(req.user.id)
    .then(user => {
      res.send({
        id: user.id,
        photo: user.profile_photo,
        nickname: user.nickname,
        like: user.like
      })
    })
})

// router를 exports에서 불러온다.
module.exports = router

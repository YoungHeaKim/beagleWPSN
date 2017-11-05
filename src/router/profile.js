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

/**
 * @api {get} /api/profile Request Users data and Rooms
 * @apiName Default list
 * @apiGroup Profile
 *
 * @apiParam
 *
 * @apiSuccess {Integer} id User의 id
 * @apiSuccess {String} provider Ouath를 사용하여 가져온
 * @apiSuccess {Integer} provider_user_id User의 고유 번호
 * @apiSuccess {String} nickname User의 닉네임
 * @apiSuccess {String} access_token User의 허용 토큰
 * @apiSuccess {Url} profile_photo User의 프로필 사진
 * @apiSuccess {Integer} like User의 좋아요(인기)
 * @apiSuccess {Integer} id chat_room의 id
 * @apiSuccess {String} name 대화방 제목
 * @apiSuccess {String} description 대화방의 설명
 * @apiSuccess {Date} start_at 대화방이 생성된 시간
 * @apiSuccess {Url} city_photo 도시의 이미지
 * @apiSuccess {Integer} creator 대화방 생성자의 정보
 * @apiSuccess {Integer} city_id 도시 이름
 * @apiSuccess {Integer} id chat_room의 id
 * @apiSuccess {String} name 대화방 제목
 * @apiSuccess {String} description 대화방의 설명
 * @apiSuccess {Date} start_at 대화방이 생성된 시간
 * @apiSuccess {Url} city_photo 도시의 이미지
 * @apiSuccess {Integer} creator 대화방 생성자의 정보
 * @apiSuccess {Integer} city_id 도시 이름
 *
 * @apiSuccessExample {json} Success-Response:
 * http://localhost:3000/api/profile?id=16
 *
 *[
 *  {
 *      "id": 16,
 *      "provider": "google",
 *      "provider_user_id": "104598204614686313946",
 *      "nickname": "김용해",
 *      "access_token": "ya29.GlzqBIYf3dBREBvde0DmNr7HADlCueVlvreDYdlUC8uo0StOVy5Z2LEtCC1RHD7kgwoZg5IwBZ9UVK4QQdAq1jcBp-0W7Hmn7iC5r74wHwY",
 *      "profile_photo": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",
 *      "like": 70
 *  },
 *  [
 *      // creator인 방의 정보
 *      [
 *          {
 *              "id": 2,
 *              "name": "재외국민을",
 *              "description": "헌법에 재외국민을 창달에 승인된 유죄의 신체의 형에. 국제법규는 있다. 의하여 도피 모든 체결·공포된 비밀과 헌법에 유죄의. 일반적으로 해당하는 유죄의. 권리는 국민은 의하여 헌법에 의하여 예술가의 국내법과. 저작자·발명가·과학기술자와 행위로 국내법과 거듭 이상의 가진다. 평생교육을 추정된다. 진다. 필요한.",
 *              "start_at": "2016-01-16T15:00:00.000Z",
 *              "photo": "http://lorempixel.com/640/480/city",
 *              "creator": 16,
 *              "city_id": 16
 *          }
 *      ],
 *      // cretor가 아닌 단순 참가자인 방의 정보
 *      [
 *          {
 *              // 해당 방의 id를 넘겨준다.
 *              "id": 40,
 *              "name": "자유를",
 *              "description": "추정된다. 정한다. 국민은 3년 조약과 국내법과 효력을 아니하며, 아니한다.. 범하고 다만, 노력하여야 한다. 의무를 진다. 일반적으로 한다. 형사피고인은. 처벌받지 의하여 현행범인인 모든 국제법규는 기능을 비밀과 무죄로 도피 필요한. 국제법규는 범죄에 신체의 의하여 진다. 국제법규는 법률로써 보호한다. 무상으로.",
 *              "start_at": "2017-10-22T15:00:00.000Z",
 *              // 해당 방의 사진
 *              "photo":  "http://lorempixel.com/640/480/city",
 *              "creator": 20,
 *              "city_id": 12
 *          }
 *  ]
 *]
 */

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
    //   const chatRoom = chatRooms.map(function(id, index, array) {
    //     return id.id
    //   })
    //   for(i=0, i > chatRooms.length, i++) {
    //     return query.getUserProfilePhotoByRoom(chatRoom[i])
    //   }
    // })
    .then(rooms => {
      return query.checkCreatorById(rooms, currentUser)
    })

  Promise.all([userInfo, roomInfo])
    .then(result => {
      res.send(result)
    })
})

/**
 * @api {patch} /api/nickname Update Users nickname
 * @apiName Default list
 * @apiGroup Profile
 *
 * @apiParam
 *
 * @apiSuccess {Integer} id User의 id
 * @apiSuccess {String} nickname 바뀐 User의 nickname 정보
 *
 * @apiSuccessExample {json} Success-Response:
 * http://localhost:3000/api/profile/nickname
 *
 *{
 *  "id": 16,
 *  "nickname": "youngheakim"
 *}
 */
// user의 nickname을 수정하는 부분
router.patch('/nickname', (req, res, next) => {
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


router.put('/like', (req, res) => {
  query.updateLikeById(req.user.id)
    .then(like => {
      res.json({ok: true})
    })
})

/**
 * @api {delete} /api/delete delete the room
 * @apiName Default list
 * @apiGroup Profile
 *
 * @apiParam
 *
 * @apiSuccess {Integer} id 삭제가 된 대화방의 id
 *
 * @apiSuccessExample {json} Success-Response:
 * http://localhost:3000/api/profile/delete/4
 *
 *{
 *  deleteRoom: [
 *  {
 *    room_id: 4
 *  }
 *]
 *}
 */

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

const socketioJwt = require('socketio-jwt')
const {createLog, getNicknameAndPhotoById} = require('../chatquery')
const {getUserById} = require('../authquery')

function chatConnect(io) {
  console.log('inner function now')
  io.set('origins', process.env.TARGET_ORIGIN);

  const chatNsp = io.of('/chat')

  chatNsp.use(socketioJwt.authorize({
    secret: process.env.SECRET,
    handshake: true
  }))
  
  chatNsp.use((socket, next) => {
    if (socket.decoded_token.id) {
      next()
    } else {
      next(new Error('Authentication Error'))
    }
  })

  chatNsp.on('connection', socket => {
    console.log('connected!!!')

    let roomId;
    let nickname;
    let profile_photo;
    const id = socket.decoded_token.id
    console.log(id)

    getNicknameAndPhotoById(id)
      .then(user => {
        nickname = user.nickname
        profile_photo = user.profile_photo
      })
      .then(() => {
        console.log(`user(${nickname}) connected`)
      })
    // 토큰에서 유저아이디 대신 닉네임을 불러올 예정, socket.decoded_token.nickname
    // id로 바꿔야 한다
    

    // join 이벤트
    // 해당 소켓을 room에 연결시킨다.
    // 클라이언트에 username을 보낸다.
    // 유저가 접속했다는 사실을 다른 모든 유저에게 전송한다.
    socket.on('room', (data, ack) => {
      console.log('room attacted..')

      roomId = data.room
      socket.join(roomId)
      const message = `${nickname}님이 입장하셨습니다.`

      createLog({message, user_id: id, chat_room_id: roomId})

      // 프로필 포토까지 넘겨줘서 앞에 참여목록에 넣을 수 있도록 한다. 
      socket.broadcast.to(roomId).emit('user connected', {user_id: id, message, nickname, profile_photo})
      // ack({nickname})
    })

    // chat 이벤트
    // 성공적으로 전송되었다는 사실을 클라이언트에 알림
    // 해당 클라이언트를 제외한 모든 클라이언트에게 메시지 전송
    socket.on('new chat', (data, ack) => {
      console.log('new chat arrived...!')

      //디비에 저장하셈 
      createLog({message: data.message, user_id: data.user_id, chat_room_id: roomId})

      socket.broadcast.to(roomId).emit('received chat', {
        message: data.message,
        user_id: data.user_id,
        created_at: data.created_at
      })
      // ack({ok: true})
    })

    // disconnect 내장 이벤트
    // 한 클라이언트의 연결이 끊어졌을 때
    // 다른 모든 클라이언트에 알림
    socket.on('disconnect', () => {
      const message = `${nickname}님이 퇴장하셨습니다.`
      createLog({message, user_id: id, chat_room_id: roomId})
      chatNsp.to(roomId).emit('user disconnected', {user_id: id, message, nickname})
    })
  })
}

module.exports = chatConnect
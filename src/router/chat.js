const socketioJwt = require('socketio-jwt')
const {createLog, getNicknameAndPhotoById, getFirstLogs, getLogs} = require('../chatquery')
const {getUserById} = require('../authquery')

function chatConnect(io) {
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

    getNicknameAndPhotoById(id)
      .then(user => {
        nickname = user.nickname
        profile_photo = user.profile_photo
      })
      .then(() => {
        console.log(`user(${nickname}) connected`)
      })
      
    // join 이벤트
    // 해당 소켓을 room에 연결시킨다.
    // 클라이언트에 username을 보낸다.
    // 유저가 접속했다는 사실을 다른 모든 유저에게 전송한다.
    socket.on('room', (data, ack) => {
      console.log('room attacted..')

      roomId = data.room
      socket.join(roomId)
      // 프로필 포토까지 넘겨줘서 앞에 참여목록에 넣을 수 있도록 한다. 
      getFirstLogs({chat_room_id: roomId})
        .then(logs => {
          ack({logs})
        })

      socket.broadcast.to(roomId).emit('user connected', {user_id: id, nickname, profile_photo})
    })

    // chat 이벤트
    // 성공적으로 전송되었다는 사실을 클라이언트에 알림
    // 해당 클라이언트를 제외한 모든 클라이언트에게 메시지 전송
    socket.on('new chat', (data, ack) => {
      console.log('new chat arrived...!')

      // if(!roomId) {
      //   roomId = data.room_id
      // }

      //디비에 저장하셈 
      createLog({message: data.message, user_id: data.user_id, chat_room_id: roomId})
        .then(log => {
          console.log(log)
          ack(log)
          socket.broadcast.to(roomId).emit('received chat', log)
        })
    })

    // log 이벤트
    // 스크롤 이벤트로 인해 새로운 로그를 앞으로 보내줘야 할때 
    // id값을 받아서 진행한다. data.id 
    socket.on('log request', (data, ack) => {
      console.log('new logs requested')

      getLogs({chat_room_id: roomId, id: data.id})
        .then(logs => {
          ack({logs})
        })
    })

    // disconnect 내장 이벤트
    // 한 클라이언트의 연결이 끊어졌을 때
    // 다른 모든 클라이언트에 알림
    socket.on('disconnect', () => {
      console.log('디스커넥트 이벤트가 도착했습니다.')
      chatNsp.to(roomId).emit('user disconnected', {nickname})
    })
  })
}

module.exports = chatConnect
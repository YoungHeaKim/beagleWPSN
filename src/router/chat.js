const socketioJwt = require('socketio-jwt')
const {createLog, getNicknameAndPhotoById, getFirstLogs, getLogs} = require('../chatquery')
const {getUserById} = require('../authquery')

function chatConnect(io) {
  // cors 세팅
  io.set('origins', '*:*');
  // chat이라는 네임스페이스 생성
  const chatNsp = io.of('/chat')
  // socketioJwt로 socket.io에서 decoded token의 정보를 사용할 수 있도록 함 
  chatNsp.use(socketioJwt.authorize({
    secret: process.env.SECRET,
    handshake: true
  }))
  // decoded token에 id가 있으면 패스 아니면 에러 
  chatNsp.use((socket, next) => {
    if (socket.decoded_token.id) {
      next()
    } else {
      next(new Error('Authentication Error'))
    }
  })
  // 채팅방에 연결되었을때 
  chatNsp.on('connection', socket => {
    let roomId;
    let nickname;
    let profile_photo;
    const id = socket.decoded_token.id
    // 새로 들어온 사람의 닉네임과 사진을 가져온다.
    getNicknameAndPhotoById(id)
      .then(user => {
        nickname = user.nickname
        profile_photo = user.profile_photo
      })
      .then(() => {
        console.log(`user(${nickname}) connected`)
      })
      
    // room 이벤트
    // 해당 소켓을 room에 연결시킨다.
    // 클라이언트에 접속한 유저의 정보를 보낸다.
    // 유저가 접속했다는 사실을 다른 모든 유저에게 전송한다.
    socket.on('room', (data, ack) => {

      roomId = data.room
      socket.join(roomId)
      // 지난 로그를 가져와 클라이언트에 넘겨준다. 
      getFirstLogs({chat_room_id: roomId})
        .then(logs => {
          ack({logs})
        })

      socket.broadcast.to(roomId).emit('user connected', {user_id: id, nickname, profile_photo})
    })

    // new chat 이벤트
    // 성공적으로 전송되었다는 사실을 클라이언트에 알림
    // 해당 클라이언트를 제외한 모든 클라이언트에게 메시지 전송
    socket.on('new chat', (data, ack) => {

      // 데이터베이스에 새로 생성된 로그를 저장 
      createLog({message: data.message, user_id: data.user_id, chat_room_id: roomId})
        .then(log => {
          // 로그가 성공적으로 들어왔음을 알려준다. 
          ack(log)
          socket.broadcast.to(roomId).emit('received chat', log)
        })
    })

    // log 이벤트
    // 스크롤 이벤트로 인해 이전 로그를 앞으로 보내줘야 할때 
    // id값을 받아서 진행한다. data.id 
    socket.on('log request', (data, ack) => {
      // 로그를 가져온다.
      getLogs({chat_room_id: roomId, id: data.id})
        .then(logs => {
          ack({logs})
        })
    })

    // disconnect 내장 이벤트
    // 한 클라이언트의 연결이 끊어졌을 때
    // 다른 모든 클라이언트에 알림
    socket.on('disconnect', () => {
      chatNsp.to(roomId).emit('user disconnected', {nickname})
    })
  })
}

module.exports = chatConnect
function chatConnect(io) {

  const chatNsp = io.of('/chat')

  chatNsp.on('connection', socket => {
    console.log('connected!!!')

    let roomId;
    // 토큰에서 유저아이디 대신 닉네임을 불러올 예정, socket.decoded_token.nickname
    const nickname = '익명의 사용자'
    console.log(`user(${nickname}) connected`)

    // join 이벤트
    // 해당 소켓을 room에 연결시킨다.
    // 클라이언트에 username을 보낸다.
    // 유저가 접속했다는 사실을 다른 모든 유저에게 전송한다.
    socket.on('room', (data, ack) => {
      console.log('room attacted..')

      roomId = data.id
      socket.join(roomId)
      socket.broadcast.to(roomId).emit('user connected', {nickname})
      // ack({nickname})
    })

    // chat 이벤트
    // 성공적으로 전송되었다는 사실을 클라이언트에 알림
    // 해당 클라이언트를 제외한 모든 클라이언트에게 메시지 전송
    socket.on('new chat', (data, ack) => {
      console.log('new chat arrived...!')
      console.log(data)

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
      chatNsp.to(roomId).emit('user disconnected', {nickname})
    })
  })
}

module.exports = chatConnect
// // 일단 함수화는 하지 않은 상태이며 아직 프론트와 루트가 합의되지는 않은 상태입니다.
// const socketio = require('socket.io')
// const socketioJwt = require('socketio-jwt')

// const httpServer = http.Server(app)
// const io = socketio(httpServer)

// // 들어와야 하는 데이터: app, httpServer

// // socket.io에서 토큰을 사용할 수 있도록 설정    
// io.use(socketioJwt.authorize({
//   secret: process.env.SECRET,
//   handshake: true
// }))

// io.use((socket, next) => {
//   if (socket.decoded_token.id) {
//     next()
//   } else {
//     next(new Error('Authentication Error'))
//   }
// })

// const chatNsp = io.of('/chat')

// chatNsp.on('connection', socket => {
//   let roomId;
//   // 토큰에서 유저아이디 대신 닉네임을 불러올 예정 
//   const userId = socket.decoded_token.id
//   console.log(`user(${userId}) connected`)

//   // join 이벤트
//   // 해당 소켓을 room에 연결시킨다.
//   // 클라이언트에 username을 보낸다.
//   // 유저가 접속했다는 사실을 다른 모든 유저에게 전송한다.
//   socket.on('join', (data, ack) => {
//     roomId = data.id
//     socket.join(roomId)
//     socket.broadcast.to(roomId).emit('user connected', {username})
//     ack({userId})
//   })

//   // chat 이벤트
//   // 성공적으로 전송되었다는 사실을 클라이언트에 알림
//   // 해당 클라이언트를 제외한 모든 클라이언트에게 메시지 전송
//   socket.on('new chat', (data, ack) => {
//     socket.broadcast.to(roomId).emit('chat', {
//       message: data.message,
//       username
//     })
//     ack({ok: true})
//   })

//   // disconnect 내장 이벤트
//   // 한 클라이언트의 연결이 끊어졌을 때
//   // 다른 모든 클라이언트에 알림
//   socket.on('disconnect', () => {
//     chatNsp.to(roomId).emit('user disconnected', {username})
//   })
// })

// httpServer.listen(PORT, () => {
//   console.log(`listenning ${PORT}...`)
// })
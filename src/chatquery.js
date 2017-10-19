// chatquery.js 
const knex = require('./knex')

module.exports = {
  getAllRooms() {

  },
  // 채팅방 생성 및 크리에이터를 챗 리스트 테이블에 추가 
  createRoom({name, description, start_at, photo=null, creator, city_id}) {
    return knex('chat_room')
      .insert({
        name,
        description,
        start_at,
        photo,
        creator,
        city_id
      })
      .then(([id]) => {
        knex('chat_list')
          .insert({
            user_id: creator,
            chat_room_id: id
          })
          .then(user => console.log(user))

        return id
      })
      .then(id => {
        return knex('chat_room')
          .where({id})
          .first()
      })
  },
  // 룸 정보를 가져온다. 
  getRoomById(id) {
    // 1번
    return knex('chat_room')  
      .where({id})
      .first()
  },
  // 앞단으로 보내야 하는 모든 정보를 합한다. 둘로 나눌까?
  getRoomInfoById({chat_room_id}) {
    // 3번 
    // 방장유저정보, 참여한 사람정보, 채팅로그, 임시 테이블 사용 
    // innerjoin 사용(채팅방정보 -> 사람정보, 채팅로그)

    const getChatListById = knex('chat_list')
        .join('user', 'user.id', 'chat_list.user_id')
        .where('chat_list.chat_room_id', chat_room_id)
        .then(user => user)

    const getChatLogById = knex('chat_log')
        .where('chat_log.chat_room_id', chat_room_id)
        .then(logs => logs)

    const getARoomById = knex('chat_room')  
        .where({id: chat_room_id})
        .first()
        .then(room => room)
    
    return Promise.all([getChatListById, getChatLogById, getARoomById])
  },
  // chat list에 이미 유저가 존재할 경우 그 값을 반환, 아닌 경우 유저를 추가함 2번 
  findOrCreateChatList({chat_room_id, user_id}) {
    return knex('chat_list')
      .where({
        chat_room_id,
        user_id
      })
      .then(list => {
        if(list === []) {
          return list
        } else {
          return knex('chat_list')
            .insert({
              chat_room_id,
              user_id
            })
        }
      })
  },
  // 새로운 채팅로그를 생성한다.
  createLog({message, chat_room_id, user_id}) {
    return knex('chat_log')
      .insert({
        message,
        chat_room_id,
        user_id
      })
      .then(log => log)
  }
}
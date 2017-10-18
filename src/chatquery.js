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
        return knex('chat_list')
          .insert({
            user_id: creator,
            chat_room_id: id
          })
      })
      .then(([chat_room_id]) => {
        return knex('chat_room')
          .where({
            id: chat_room_id
          })
          .first()
      })
  },
  getRoomById(id) {
    // 2번
    return knex('chat_room')  
      .where({id})
      .first()
  },
  IsCreator() {
    // 3번
    // getRoomById에 온 정보와 앞단에선 넘어온 유저 정보(아마도 토큰 정보)를 비교 
  },
  getRoomInfoByJoin() {
    // 4번 
    // innerjoin 사용 
  },
  // chat list에 이미 유저가 존재할 경우 그 값을 반환, 아닌 경우 유저를 추가함 
  findOrCreateChatList({chat_room_id, user_id}) {
    return knex('chat_list')
      .where({
        chat_room_id,
        user_id
      })
      .then(list => {
        if(list) {
          return list
        } else {
          return knex('chat_list')
            .insert({
              chat_room_id,
              user_id
            })
            .first()
        }
      })
  }
}
// chatquery.js 
const knex = require('./knex')

module.exports = {
  getAllRooms() {

  },
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
        return knex('chat_room')
          .where({id})
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
    // getRoomById에 온 정보와 앞단에선 넘어온 유저 정보(아마도 params)를 비교 
  },
  getRoomInfoByJoin() {
    // 4번 
    // innerjoin 사용 
  },
  findOrCreateChatList() {
    // 1번 
    // 앞단에서 넘어온 유저 정보로 챗 리스트에 이미 정보가 존재하는지 아닌지 파악 
    // 채팅방 룸 아이디로 챗 리스트 테이블의 유저들을 가져온 다음에 존재하는지 파악하면 된다. 
  }
}
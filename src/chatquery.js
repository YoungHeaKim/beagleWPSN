// chatquery.js 
const knex = require('./knex')

module.exports = {
  getNicknameAndPhotoById(id) {
    return knex('user')
      .select('nickname', 'profile_photo')
      .where({id})
      .first()
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
          .then(user => {
            return id
          })
      })
      .then(id => {
        return knex('chat_room')
          .where({id})
          .select('id')
          .first()
      })
      .catch(e => {
        throw new Error('타입이 일치하지 않습니다.')
      })
  },
  // 앞단으로 보내야 하는 모든 정보를 합한다. 둘로 나눌까?
  getRoomInfoById({chat_room_id}) {

    const getChatListById = knex('chat_list')
        .select('user_id', 'chat_room_id','nickname', 'profile_photo', 'like')
        .join('user', 'user.id', 'chat_list.user_id')
        .where('chat_list.chat_room_id', chat_room_id)

    const getARoomById = knex('chat_room')  
        .where({id: chat_room_id})
        .first()
    
    return Promise.all([getChatListById, getARoomById])
  },
  findOrCreateChatList({chat_room_id, user_id}) {
    return knex('chat_list')
      .where({
        chat_room_id,
        user_id
      })
      .first()
      .then(list => {
        if(list) {
          return list
        } else {
          return knex('chat_list')
            .insert({
              chat_room_id,
              user_id
            })
        }
      })
      .catch(e => {
        throw new Error('존재하는 방이 아닙니다.')
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
      .then(([id]) => {
        console.log(id)
        return knex('chat_log')
          .where({id})
          .first()
      })
  },
  // 이전 로그를 가져온다. 
  getLogs({chat_room_id, id}) {
    return knex('chat_log')
      .where({chat_room_id})
      .andWhere('id', '<', id)
      .orderBy('id', 'desc')
      .limit(7)
  },
  getFirstLogs({chat_room_id}) {
    return knex('chat_log')
      .where({chat_room_id})
      .orderBy('id', 'desc')
      .limit(7)
  },
  findRoomsIdByUserId(user_id) {
    return knex('chat_list')
      .select('chat_room_id')
      .where({user_id})
  }
}
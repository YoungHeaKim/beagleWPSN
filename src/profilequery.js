// profilequery.js
const knex = require('./knex.js')

module.exports = {
  // 채팅방 삭제하는 코드
  deleteRoom(id) {
    return knex('chat_room')
      .where({id})
      .delete()
  },
  // 여러개의 대화방을 가져올 수 있는 대화방 쿼리
  getRoomsById(id) {
    return knex('chat_room')
      .where({creater})
      .first()
  }
  // user정보 수정하는 코드

}

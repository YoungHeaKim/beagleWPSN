// profilequery.js
const knex = require('./knex.js')

module.exports = {
  // 채팅방 삭제하는 코드
  deleteRoom(id) {
    return knex('chat_room')
      .where({id})
      .delete()
  },
  // user정보 수정하는 코드

}

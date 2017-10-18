// profilequery.js
cosnt knex = require('./knex.js')

module.exports = {
  // 채팅방 삭제하는 코드
  deleteRoom(id) {
    return knex('chat_room')
      .where({id})
      .delete()
  },
  // 해당 user에 user정보와 참가하고 있는 room정보를 가져온다.
  getProfile() {
    return knex('user')
  }
  // user정보 수정하는 코드

}

const knex = require('../knex.js')
const {getRoomInfoById} = require('./chatquery')

module.exports = {
  // 여러개의 대화방을 가져올 수 있는 대화방 쿼리
  getRoomsById(currentUser) {
    return knex('chat_list')
    .where({user_id: currentUser})
    .then((rooms) => {
      // 빈배열을 만들어준다.
      const arr = [];
      // 위에서 가져온 rooms을 돌려 arr의 빈배열에 room_id를 하나씩 넣어주는 작업
      rooms.map(room => {
        arr.push(knex('chat_room')
        // chat_room안에 있는 id에 room이라는 객체에서 가져온 id를 넣어준다.
        .where({id: room.chat_room_id})
        .orderBy('id', 'desc')
        .first()
      )})
      return Promise.all(arr)
    })
  },
  // 해당 방의 모든 유저를 가져오는 쿼리
  selectUserByRoom(chat_room_id) {
    return knex('chat_list')
      .join('chat_room', 'chat_room.id', 'chat_list.chat_room_id')
      .select('chat_list.user_id', 'chat_room.creator')
      .where({chat_room_id})
      .orderBy('user_id', 'desc')
  },
  // 위에서 가져온 데이터를 가져와 creater인지 아닌지를 비교해주는 쿼리
  checkCreatorById(rooms, currentUser) {
    const myRooms = []
    const otherRooms = []

    rooms.map(room => {
      if(room.creator === currentUser) {
        myRooms.push(room)
      } else {
        otherRooms.push(room)
      }
    })

    return [myRooms, otherRooms]
  },
  // 해당유저에 채팅방 삭제하는 코드
  exitRoom(user_id, chat_room_id) {
    return knex('chat_list')
      .where({user_id, chat_room_id})
      .del()
      .catch(e => {
        throw new Error('해당 방에 해당 유저가 존재하지 않습니다.')
      })
  },
  // 해당유저가 한명만 있을 경우 채팅방을 삭제하는 코드
  deleteRoom(chat_room_id) {
    return knex('chat_list')
      .where({chat_room_id})
      .del()
      .then(() => {
        return knex('chat_room')
          .where({id: chat_room_id})
          .del()
      })
  },
  // 해당유저가 채팅방이 삭제될 때 방장의 권한이 좋아요가 높은 유저에게 넘어가는 코드
  findNextCreator({chat_room_id, user_id}) {
    return knex('chat_list')
      .join('chat_room', 'chat_room.id', 'chat_list.chat_room_id')
      .join('user', 'user.id', 'chat_list.user_id')
      .where({chat_room_id})
      .whereNot({user_id})
      .orderBy('chat_room_id', 'desc')
      .orderBy('like', 'desc')
      .first()
  },
  // 방장을 업데이트해주는 쿼리
  updateCreator(user_id, resultUser) {
    return knex('chat_room')
      .where({creator: user_id})
      .update({creator: resultUser})
  },
  // user정보 수정하는 코드
  modifyUserInfoById(user_id, nickname){
    return knex('user')
      .where({id: user_id})
      .update({nickname})
  },
  // 현재 채팅방에 참여중인 user들의 사진가져오기
  getUserProfilePhotoByRoom(chatRoom) {
    return knex('chat_list')
      .join('user', 'user.id', 'chat_list.user_id')
      .select('user.id', 'user.like', 'user.profile_photo', 'user.nickname')
      .where({chat_room_id: chatRoom})
      .orderBy('like', 'desc')
  },
  getRoomsByUserId(id) {
    return knex('chat_list')
      .where({user_id: id})
      .then(rooms => {
        const arr = []

        rooms.map(room => {
          arr.push(getRoomInfoById({chat_room_id: room.chat_room_id}))
        })

        return Promise.all(arr)
      })
  },
  getARoomByRoomId(id) {
    return knex('chat_room')
      .where({id})
      .first()
  },
}

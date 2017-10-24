// profilequery.js
const knex = require('./knex.js')

module.exports = {
  // 여러개의 대화방을 가져올 수 있는 대화방 쿼리
  getRoomsById(user_id) {
    return knex('chat_list')
    .where({user_id})
    .then((rooms) => {
      console.log(rooms)
      // 빈배열을 만들어준다.
      const arr = [];
      // 위에서 가져온 rooms을 돌려 arr의 빈배열에 room_id를 하나씩 넣어주는 작업
      rooms.map(room => {
        arr.push(knex('chat_room')
        // chat_room안에 있는 id에 room이라는 객체에서 가져온 id를 넣어준다.
        .where({id: room.chat_room_id})
        .first()
      )})
      return Promise.all(arr)
    })
  },
  // 현재 채팅방에 참여중인 user들의 사진가져오기
  // getUserProfilePhotoByRooms(profile_photo) = {
  //   return knex('chat_list')
  //     .where({})
  //     .then()
  // }
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
  // 채팅방 삭제하는 코드
  deleteRoom(id, creator) {
    return knex('chat_room')
      .where({id, creator})
      .del()
  },
  // user정보 수정하는 코드
  modifyUserInfoById(user_id, nickname){
    return knex('user')
      .where({id: user_id})
      .update({nickname})
  }
}

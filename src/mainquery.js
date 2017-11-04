const knex = require('./knex')

module.exports = {
<<<<<<< HEAD
  // user, chat_room, city table을 연결하는 코드
  getMainChatRoomList () {
=======
  getAllRoomList() {
>>>>>>> f80eab65184737c38eb1d8fb7b80b70b5a7ca082
    return knex('user')
      .join('chat_room', 'chat_room.creator', 'user.id')
      .join('city', 'chat_room.city_id', 'city.id')
      .select('chat_room.city_id', 'chat_room.id', 'user.id as initUserId', 'chat_room.name', 'chat_room.description',  'chat_room.photo', 'user.nickname', knex.raw("DATE_FORMAT(chat_room.start_at, '%Y-%m-%d') as start_at"), 'user.profile_photo', 'user.like', 'city.city_name', 'city.city_photo')
  },
<<<<<<< HEAD
  // city_id 또는 start_at data가 있으면 실행하는 쿼리
  getCityAndStartAtData({city_id, start_at}){
    const query = this.getMainChatRoomList()
    if(city_id){
=======

  getCityStartData({city_id, start_at}) {
    const query = this.getAllRoomList()
    if (city_id) {
>>>>>>> f80eab65184737c38eb1d8fb7b80b70b5a7ca082
      query.where({city_id})
      if (start_at) {
        query.where({start_at})
      }
    }
    if (start_at) {
      query.where({start_at})
      if (city_id) {
        query.where({city_id})
      }
    }
    return query
  },

  getLikeOrIdData({like, id, ...others}) {
    const query = this.getCityStartData(others)
    if (like) {
      query.orderBy('like', 'desc')
        .orderBy('chat_room.id', 'desc')
    } else if (id) {
      query.orderBy('chat_room.id', 'desc')
    } else {
      query.orderBy('chat_room.id', 'desc')
    }
    return query
  },

  getAllData({lastId, lastLike, ...others}) {
    const query = this.getLikeOrIdData(others)
        lastId = parseInt(lastId)
        lastLike = parseInt(lastLike)
    if (lastId && lastLike != null) {
      query.where( function () {
        this.where(
          function () {
          this.where('like', lastLike)
          .andWhere('chat_room.id', '<', lastId)
        })
        .orWhere('like', '<', lastLike)
      })
    }
    return query
  }
}

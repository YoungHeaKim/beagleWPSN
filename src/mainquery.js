const knex = require('./knex')

module.exports = {
  getAllRoomList () {
    return knex('user')
      .join('chat_room', 'chat_room.creator', 'user.id')
      .join('city', 'chat_room.city_id', 'city.id')
      .select('chat_room.city_id', 'chat_room.id', 'user.id as initUserId', 'city.id as initCityId', 'chat_room.name', 'chat_room.description',  'chat_room.photo', 'user.nickname', knex.raw("DATE_FORMAT(chat_room.start_at, '%Y-%m-%d') as start_at"), 'user.profile_photo', 'user.like', 'city.city_name', 'city.city_photo')
  },
  getDataRoomList ({city_id, start_at, like, id}) {
    let query = this.getAllRoomList()
    if(city_id && start_at){
      if(like){
        query.where({city_id})
          .where({start_at})
          .orderBy('like', 'desc')
          .orderBy('chat_room.id', 'desc')
      }else if(id){
        query.where({city_id})
          .where({start_at})
          .orderBy('chat_room.id', 'desc')
      }
    }
    else if (city_id) {
      if(like){
        query.where({city_id})
          .orderBy('like', 'desc')
          .orderBy('chat_room.id', 'desc')
      }
      else if(id){
        query.where({city_id})
          .orderBy('chat_room.id', 'desc')
      }
    }else if (start_at) {
      if(like){
        query.where({start_at})
          .orderBy('like', 'desc')
          .orderBy('chat_room.id', 'desc')
      }
      else if(id){
        query.where({start_at})
          .orderBy('chat_room.id', 'desc')
      }
    }else if(like){
      query.orderBy('like', 'desc')
        .orderBy('chat_room.id', 'desc')
    }else if(id){
      query.orderBy('chat_room.id', 'desc')
    }else {
      query.orderBy('chat_room.id', 'desc')
    }
    return query
  },
  getIdLikeData({lastId, lastLike, ...others}){
    let query = this.getDataRoomList(others)
        lastId = parseInt(lastId)
        lastLike = parseInt(lastLike)
    if(lastId){
      query.andWhere('chat_room.id', '<', lastId)
    }
    return query
  }
}

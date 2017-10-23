const knex = require('./knex')

module.exports = {
  getAllRoomList () {
    return knex('user')
      .join('chat_room', 'chat_room.creator', 'user.id')
      .join('city', 'chat_room.city_id', 'city.id')
      .select('chat_room.city_id', 'chat_room.id', 'chat_room.name', 'chat_room.description', 'chat_room.start_at', 'chat_room.photo', 'user.nickname', 'user.profile_photo', 'user.like', 'city.city_name', 'city.city_photo')
      .limit(12)
   },
   getDataRoomList ({city_id, start_at, like, id}) {
    let query = this.getAllRoomList()
    if(city_id && start_at){
      if(like){
        query = query.where({city_id, start_at})
        query = query.orderBy('like', 'desc')
      }else if(id){
        query = query.where({city_id, start_at})
        query = query.orderBy('id', 'desc')
      }
    }else if (city_id) {
      if(like){
        query = query.where({city_id})
        query = query.orderBy('like', 'desc')
      }
      else if(latest){
        query = query.where({city_id})
        query = query.orderBy('latest', 'desc')
      }
    }else if (start_at) {
      if(like){
        query = query.where({start_at})
        query = query.orderBy('like', 'desc')
      }
      else if(latest){
        query = query.where({start_at})
        query = query.orderBy('latest', 'desc')
      }
    }
    return query
      .select('chat_room.id', 'chat_room.name', 'chat_room.description', 'chat_room.start_at', 'chat_room.photo', 'user.nickname', 'user.profile_photo', 'user.like', 'city.city_name', 'city.city_photo')
  },
}

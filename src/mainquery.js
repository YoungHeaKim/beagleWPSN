const knex = require('./knex')

module.exports = {
  getAllRoomList () {
    return knex('user')
      .join('chat_room', 'chat_room.creator', 'user.id')
      .join('city', 'chat_room.city_id', 'city.id')
      .select('chat_room.id', 'chat_room.name', 'chat_room.description', 'chat_room.start_at', 'chat_room.photo', 'user.nickname', 'user.profile_photo', 'user.like', 'city.city_name', 'city.city_photo')
   },
}

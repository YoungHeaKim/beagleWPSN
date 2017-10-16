// chatquery.js 
const knex = require('./knex')

module.exports = {
  getAllRooms() {

  },
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
        return knex('chat_room')
          .where({id})
          .first()
      })
  },
  getRoomById() {

  }
}
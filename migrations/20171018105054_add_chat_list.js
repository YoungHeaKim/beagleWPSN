
exports.up = (knex, Promise) => {
  return knex.schema.createTable('chat_list', t => {
    t.integer('user_id').unsigned().notNullable()
    t.foreign('user_id').references('user.id')
    t.integer('chat_room_id').unsigned().notNullable()
    t.foreign('chat_room_id').references('chat_room.id')
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('chat_list')
};

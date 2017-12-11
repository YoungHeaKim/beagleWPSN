
exports.up = (knex, Promise) => {
  return knex.schema.createTable('chat_log', t => {
    t.increments()
    t.integer('user_id').unsigned().notNullable()
    t.foreign('user_id').references('user.id')
    t.integer('chat_room_id').unsigned().notNullable()
    t.foreign('chat_room_id').references('chat_room.id').onDelete('cascade')
    t.text('message').notNullable()
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.boolean('pinned').defaultTo(false)
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('chat_log')
};

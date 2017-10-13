
exports.up = function(knex, Promise) {
  return knex.schema.createTable('chat_room', t => {
    t.increments()
    t.string('name').notNullable()
    t.text('description').notNullable()
    t.date('start_at').notNullable()
    t.index('start_at')
    t.string('photo')
    t.integer('creator').unsigned().notNullable()
    t.foreign('creator').references('user.id')
    t.integer('city_id').unsigned().notNullable()
    t.foreign('city_id').references('city.id')
  })
};

exports.down = function(knex, Promise) {
  
};

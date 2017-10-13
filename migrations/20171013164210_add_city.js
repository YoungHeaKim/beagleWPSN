
exports.up = function(knex, Promise) {
  return knex.schema.createTable('city', t => {
    t.increments()
    t.string('city_name').notNullable()
    t.string('city_photo').notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('city')
};

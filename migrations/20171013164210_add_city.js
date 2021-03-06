
exports.up = (knex, Promise) => {
  return knex.schema.createTable('city', t => {
    t.increments()
    t.string('city_name').notNullable()
    t.string('city_photo')
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('city')
};

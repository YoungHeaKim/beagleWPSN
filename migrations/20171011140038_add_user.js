
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', t => {
    t.increments()
    t.string('provider').notNullable()
    t.string('provider_user_id').notNullable()
    t.string('nickname').unique()
    t.string('access_token')
    t.string('profile_photo')
    t.integer('like').defaultTo(0)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user')
};

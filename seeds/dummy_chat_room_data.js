const faker = require('faker')
faker.locale = 'ko'

exports.seed = function(knex, Promise) {
  return knex('chat_room').del()
  then(() => {
    const arr = []
    for(var i = 1; i <= 10; i++) {
      arr.push(
        knex('chat_room')
        .insert({
          name: faker.lorem.word(),
          description: faker.lorem.sentences(),
          start_at: faker.date.between('2016-01-01', '2017-11-01'),
          photo: faker.image.city(),
          creator: Math.floor(Math.random()*1000)+1,
          city_id: Math.floor(Math.random()*19)+1,
        })
      )
    }
    return Promise.all(arr)
  })
}

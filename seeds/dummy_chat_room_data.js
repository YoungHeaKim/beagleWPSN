const faker = require('faker')
faker.locale = 'ko'

exports.seed = (knex, Promise) => {
  return knex('chat_room')
  .then(() => {
    const arr = []
    // 한번 실행시 만개의 더미데이터 생성합니다.
    for(var i = 1; i <= 10000; i++) {
      arr.push(
        knex('chat_room')
        .insert({
          name: faker.lorem.word(),
          description: faker.lorem.sentences(),
          start_at: faker.date.between('2016-01-01', '2017-11-01'),
          photo: faker.image.city(),
          // creator가 계속 변하므로 user.id확인 후 한 계정당 하나씩의 db생성바랍니다.
          // 이때 우리는 한 계정당 하나씩 db생성하는 부분이 힘들기 때문에 한번에 여러개의 유저에 대한 db를 랜덤을 돌려 생성을 한다.
          // creator의 숫자는 user.id 숫자 이므로 수정하면서 seed:run 바랍니다.
          // initial_cities는 한번만 실행하시기 바랍니다.
          creator: Math.floor(Math.random()*10)+1,
          city_id: Math.floor(Math.random()*20)+1,
        })
      )
    }
    return Promise.all(arr)
  })
}

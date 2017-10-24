// faker로 dummy image 삽입
const faker = require('faker')
const cities = [
  {city_name: 'Kyoto', city_photo: faker.image.city()},
  {city_name: 'Jeju Island', city_photo: faker.image.city()},
  {city_name: 'Parais', city_photo: faker.image.city()},
  {city_name: 'Bangkok', city_photo: faker.image.city()},
  {city_name: 'London', city_photo: faker.image.city()},
  {city_name: 'Tokyo', city_photo: faker.image.city()},
  {city_name: 'Rome', city_photo: faker.image.city()},
  {city_name: 'Osaka', city_photo: faker.image.city()},
  {city_name: 'Fukuoka', city_photo: faker.image.city()},
  {city_name: 'Prague', city_photo: faker.image.city()},
  {city_name: 'Barcelona', city_photo: faker.image.city()},
  {city_name: 'Seoul', city_photo: faker.image.city()},
  {city_name: 'New York City', city_photo: faker.image.city()},
  {city_name: 'Hong Kong', city_photo: faker.image.city()},
  {city_name: 'Los Angeles', city_photo: faker.image.city()},
  {city_name: 'Da Nang', city_photo: faker.image.city()},
  {city_name: 'Cebu', city_photo: faker.image.city()},
  {city_name: 'Hanoi', city_photo: faker.image.city()},
  {city_name: 'Sapporo', city_photo: faker.image.city()},
  {city_name: 'Singapore', city_photo: faker.image.city()}
]

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('city').del()
    .then(function () {
      // Inserts seed entries
      return knex('city').insert(cities);
    });
};

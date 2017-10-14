// 사진이 아직 없지만 데이터는 다 잘들어갑니다. 사진 필수 
const cities = [
  {city_name: 'Kyoto'}, 
  {city_name: 'Jeju Island'}, 
  {city_name: 'Paris'}, 
  {city_name: 'Bangkok'}, 
  {city_name: 'London'}, 
  {city_name: 'Tokyo'}, 
  {city_name: 'Rome'}, 
  {city_name: 'Osaka'}, 
  {city_name: 'Fukuoka'}, 
  {city_name: 'Prague'}, 
  {city_name: 'Barcelona'}, 
  {city_name: 'Seoul'}, 
  {city_name: 'New York City'}, 
  {city_name: 'Hong Kong'}, 
  {city_name: 'Los Angeles'}, 
  {city_name: 'Da Nang'}, 
  {city_name: 'Cebu'}, 
  {city_name: 'Hanoi'}, 
  {city_name: 'Sapporo'}, 
  {city_name: 'Singapore'}
]

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('city').del()
    .then(function () {
      // Inserts seed entries
      return knex('city').insert(cities);
    });
};

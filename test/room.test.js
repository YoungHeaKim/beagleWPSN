const request = require('supertest')
const jwt = require('jsonwebtoken')

const server = require('../src/index')

const token = jwt.sign({id: 6}, process.env.SECRET)

describe('POST/ api/chat-rooms', () => {
  it('필수 정보가 없으면 400 리턴', done => {
    const body = {
      name: '테스트', 
      description: '룸 테스트용', 
      start_at: '2017-10-29',
      city_id: 1
    }

    request(server)
      .post('/api/chat-rooms')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(400, done)
  })

  it('필수 정보의 타입이 맞지 않으면 400 리턴', done => {
    const body = {
      name: '테스트', 
      description: '룸 테스트용', 
      start_at: '2017-10-29',
      city_id: 1,
      creator: '크리에이터'
    }

    request(server)
      .post('/api/chat-rooms')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(400, done)
  })

  it('모든 정보가 존재할 경우 채팅방 생성', done => {
    const body = {
      name: '테스트', 
      description: '룸 테스트용', 
      start_at: '2017-10-29',
      city_id: 1,
      creator: 6
    }

    request(server)
      .post('/api/chat-rooms')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(200, done)
  })
})

describe('GET /api/chat-rooms/:id', () => {
  it('타입이 적합하지 않은 요청이였을 경우 400 리턴', done => {
    const chat_room_id = 'wrong request'

    request(server)
      .get(`/api/chat-rooms/${chat_room_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400, done)
  })

  it('요청하는 방이 존재하지 않았을 경우 404 리턴', done => {
    const chat_room_id = 300

    request(server)
      .get(`/api/chat-rooms/${chat_room_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404, done)
  })

  it('요청하는 방이 존재했을 경우 채팅방 정보 리턴', done => {
    const chat_room_id = 4

    request(server)
      .get(`/api/chat-rooms/${chat_room_id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })
})
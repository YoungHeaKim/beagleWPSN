# 비글의 API 문서

## 인덱스 페이지 관련

`GET /api/chat-rooms`

결과 데이터
  -  채팅방 리스트를 출력한다.
```js
[
    {
        "city_id": 15,
        "id": 10016,
        "initUserId": 4,
        "initCityId": 15,
        "name": "아니한다.",
        "description": "정한다. 재외국민을 정하는 또는 국민은 효력을 비밀과 의하여. 구성하지 청구할 국내법과.",
        "photo": "http://lorempixel.com/640/480/city",
        "nickname": "김정원",
        "start_at": "2016-08-31",
        "profile_photo": "http://k.kakaocdn.net/dn/dEs0Wm/btqhuWBKLC2/ifnBNerSFRsCScIAdShlkK/img_110x110.jpg",
        "like": 0,
        "city_name": "Los Angeles",
        "city_photo": "http://lorempixel.com/640/480/city"
    }, ...
]
```

`GET /api/chat-rooms?city_id=1&start_at=2017-10-01&sort=latest`

들어오는 데이터
  - 쿼리 요청으로 들어온다.
```js
[
  {
    'city_id': 1,
    'start_at': 2017-10-01,
    'sort' : latest
  }
]
```
결과 데이터
  -  채팅방 리스트를 출력한다.
```js
[
    {
        "city_id": 1,
        "id": 4815,
        "initUserId": 1,
        "initCityId": 1,
        "name": "권리는",
        "description": "보호한다. 모든 진다. 자유를 자유를 국가는 보호한다. 아니한다. 노력하여야. 보호를 행위로 국제법규는 보장하기 소추되지 증거인멸의. 위하여 무상으로 유죄의 염려가 거듭. 바에 현행범인인 정하는 조약과 소추되지 염려가 의하여 노력하여야 형에.",
        "photo": "http://lorempixel.com/640/480/city",
        "nickname": "JeongWon Kim",
        "start_at": "2017-10-01",
        "profile_photo": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/1916720_861474673971094_3917989010982626982_n.jpg?oh=4df3d8e3a708673473576be102d2db32&oe=5A772231",
        "like": 20,
        "city_name": "Kyoto",
        "city_photo": "http://lorempixel.com/640/480/city"
    }, ...
]
```

`GET /api/chat-rooms?lastId=10011&lastLike=0`

들어오는 데이터
  - 쿼리 요청으로 들어온다.
```js
[
  {
    'lastId': 10011,
    'lastLike': 0
  }
]
```

결과 데이터
  -  채팅방 리스트를 출력한다.
```js
[
    {
        "city_id": 15,
        "id": 10016,
        "initUserId": 4,
        "initCityId": 15,
        "name": "아니한다.",
        "description": "정한다. 재외국민을 정하는 또는 국민은 효력을 비밀과 의하여. 구성하지 청구할 국내법과.",
        "start_at": "2016-08-30T15:00:00.000Z",
        "photo": "http://lorempixel.com/640/480/city",
        "nickname": "김정원",
        "profile_photo": "http://k.kakaocdn.net/dn/dEs0Wm/btqhuWBKLC2/ifnBNerSFRsCScIAdShlkK/img_110x110.jpg",
        "like": 0,
        "city_name": "Los Angeles",
        "city_photo": "http://lorempixel.com/640/480/city"
    }, ...
]
```

`GET /api/chat-rooms?city_id=3&start_at=2017-10-02&sort=latest&lastId=7013&lastLike=10`

들어오는 데이터
  - 쿼리 요청으로 들어온다.
```js
[
  {
    'city_id': 3,
    'start_at': 2017-10-02,
    'sort': 'latest',
    'lastId': 7013,
    'lastLike': 10
  }
]
```

결과 데이터
  -  채팅방 리스트를 출력한다.
```js
[
    {
        "city_id": 3,
        "id": 3107,
        "initUserId": 3,
        "initCityId": 3,
        "name": "권리는",
        "description": "국민은 효력을 가진다. 신체의 일반적으로. 위하여 노력하여야 계승·발전과 국제법규는 해당하는. 유죄의 신문의 진다. 모든 경우와 아니한다. 진흥하여야 아니한다.. 국가는 의무를 염려가 노력하여야 국가는 아니한다.. 일반적으로 현행범인인 가진다. 형사피고인은 의하여 국내법과.",
        "photo": "http://lorempixel.com/640/480/city",
        "nickname": "김정원",
        "start_at": "2017-10-02",
        "profile_photo": "https://ssl.pstatic.net/static/pwe/address/img_profile.png",
        "like": 100,
        "city_name": "Parais",
        "city_photo": "http://lorempixel.com/640/480/city"
    }, ...
]
```

## 채팅방 관련

`POST  /api/chat-rooms`

들어오는 데이터
- 채팅방 생성에 필요한 데이터
```js
{
  name: '도쿄로 여행가요!',
  description: '12월 7일에 도쿄로 여행갈 사람 구합니다.',
  start_at: '2017-12-07',
  photo: 'photo_url',
  creator: 1,
  city_id: 1
}
```

결과 데이터
- 생성된 채팅방의 아이디를 돌려줍니다.
```js
{
  id: 1
}
```

`GET  /api/chat-rooms/:id`

들어오는 데이터
- 특정 채팅방을 불러오는데 필요한 데이터
```js
{
  id: 1
}
```

결과 데이터
- 첫번째 요소: 현재 채팅방에 참여하고 있는 유저들을 배열로 반환(새로 만든 채팅방의 경우 한명)
- 두번째 요소: 생성된 채팅방의 정보를 반환
```js
[
  [
    {
      user_id: 1,
      nickname: '닉네임',
      profile_photo: 'my_photo_url'
    }
  ],
  {
    id: 1,
    description: '12월 7일에 도쿄로 여행갈 사람 구합니다.',
    start_at: '2017-12-07',
    photo: 'photo_url',
    creator: 1,
    city_id: 1
  }
]
```

`socket.on('room')`

들어오는 데이터
- 유저가 특정 채팅방에 접속했을때
- 룸 아이디가 들어온다
```js
{
  room: 1
}
```

결과 데이터
- 지난 로그를 한번만 반환
```js
[
  {
    id: 4,
    user_id: 1,
    chat_room_id: 1,
    message: '도코에 가보신적 있으세요?'
  },
  {
    id: 5,
    user_id: 1,
    chat_room_id: 1,
    message: '저는 처음인데'
  },
  {
    id: 6,
    user_id: 2,
    chat_room_id: 1,
    message: '네 저는 옛날에...ㅎㅎ'
  },
]
```

`socket.emit('user connected')`

결과 데이터
- 새로운 유저가 들어왔을때 그 정보를 다른 참가자들에게 반환
```js
{
  user_id: 3,
  nickname: '세번째 유저',
  profile_photo: 'third_user_photo'
}
```

`socket.on('new chat')`

들어오는 데이터
- 새로운 유저가 들어왔을때
- 작성한 메세지가 들어옴
```js
  {
    id: 7,
    user_id: 3,
    chat_room_id: 1,
    message: '새로 왔어요!'
  },
```

`socket.emit('received chat')`

결과 데이터
- 유저가 작성한 메세지를 다른 참가자들에게 전달
```js
  {
    id: 7,
    user_id: 3,
    chat_room_id: 1,
    message: '새로 왔어요!'
  },
```

`socket.on('log request')`

들어오는 데이터
- 스크롤 이벤트가 발생했을때
- 마지막 로그의 아이디가 들어옴
```js
{
  id: 4
}
```

결과 데이터
- 지난 로그들이 시간 역순으로 반환(계속 반환된다)
```js
[
  {
    id: 1,
    user_id: 1,
    chat_room_id: 1,
    message: '안녕하세요?'
  },
  {
    id: 2,
    user_id: 1,
    chat_room_id: 1,
    message: '어서오세요'
  },
  {
    id: 3,
    user_id: 2,
    chat_room_id: 1,
    message: '네 안녕하세요'
  },
]
```

## 프로필 페이지 관련

`GET /api/profile`

들어오는 데이터
- 해당 유저의 id값이 들어온다
```js
[
  {
    id: 16
  }
]
```

query요청
`id=${user.id}`: 접속 유저의 아이디

결과 데이터
- 첫번째 요소: 로그인 유저의 대한 정보
- 두번째 요소: 로그인 유저가 방장인 방의 정보
- 세번째 요소: 로그인 유저가 단순 참여자인 방의 정보

```js
/api/profile?id=16
[
    {
        "id": 16,
        "provider": "google",
        "provider_user_id": "104598204614686313946",
        "nickname": "김용해",
        "access_token": "ya29.GlzqBIYf3dBREBvde0DmNr7HADlCueVlvreDYdlUC8uo0StOVy5Z2LEtCC1RHD7kgwoZg5IwBZ9UVK4QQdAq1jcBp-0W7Hmn7iC5r74wHwY",
        "profile_photo": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",
        "like": 70
    },
    [
        // creator인 방의 정보
        [
            {
                "id": 2,
                "name": "재외국민을",
                "description": "헌법에 재외국민을 창달에 승인된 유죄의 신체의 형에. 국제법규는 있다. 의하여 도피 모든 체결·공포된 비밀과 헌법에 유죄의. 일반적으로 해당하는 유죄의. 권리는 국민은 의하여 헌법에 의하여 예술가의 국내법과. 저작자·발명가·과학기술자와 행위로 국내법과 거듭 이상의 가진다. 평생교육을 추정된다. 진다. 필요한.",
                "start_at": "2016-01-16T15:00:00.000Z",
                "photo": "http://lorempixel.com/640/480/city",
                "creator": 16,
                "city_id": 16
            }
        ],
        // cretor가 아닌 단순 참가자인 방의 정보
        [
            {
                // 해당 방의 id를 넘겨준다.
                "id": 40,
                "name": "자유를",
                "description": "추정된다. 정한다. 국민은 3년 조약과 국내법과 효력을 아니하며, 아니한다.. 범하고 다만, 노력하여야 한다. 의무를 진다. 일반적으로 한다. 형사피고인은. 처벌받지 의하여 현행범인인 모든 국제법규는 기능을 비밀과 무죄로 도피 필요한. 국제법규는 범죄에 신체의 의하여 진다. 국제법규는 법률로써 보호한다. 무상으로.",
                "start_at": "2017-10-22T15:00:00.000Z",
                // 해당 방의 사진
                "photo": "http://lorempixel.com/640/480/city",
                "creator": 20,
                "city_id": 12
            }
    ]
]
```

`GET /api/profile/nickname`

들어오는 데이터
- 해당 유저의 nickname이 들어온다.
```js
[
  {
    nickname: youngheakim
  }
]
```

body요청
`nickname= ${nickname}`: 페이지에서 수정을 한 후 요청을 보낸다.

결과 데이터
- 바뀐 유저의 id와 바뀐 nickname의 정보가 들어간다.

```js
{
    "id": 16,
    "nickname": "youngheakim"
}
```

`DELETE /api/profile/delete/:room_id`

들어오는 데이터
- 삭제되는 채팅방의 id가 들어온다.

```js
[
  {
    room_id: 4
  }
]
```

params요청
`/${chat_room.id}` : 나가기 버튼을 누르면 해당 room_id를 params 요청으로 보낸다.

결과 데이터
- 삭제된 방의 id를 보내준다.

```js
[
  {
    id: 4
  }
]
```
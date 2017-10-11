// 파일 불러오기
const query = require('./query')

// passport 작성
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => {
  const profile_photo = profile.photos[0] ? profile.photos[0].value : null
  query.firstOrCreateUserByProvider(
    'facebook',
    profile.id,
    accessToken,
    profile_photo
  ).then(user => {
    done(null, user)
  }).catch(err => {
    done(err)
  })
}))

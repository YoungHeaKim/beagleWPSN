// 불러오기
const query = require('../query')
// passport 작성
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const NaverStrategy = require('passport-naver').Strategy
const NaverStrategy = require('passport-naver').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

// facebook
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

app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'manage_pages']
}))

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

// naver
passport.use(new NaverStrategy({
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: process.env.NAVER_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  const profile_photo = profile._json.profile_image ? profile._json.profile_image : null
  query.firstOrCreateUserByProvider(
    'naver',
    profile.id,
    accessToken,
    profile_photo
  ).then(user => {
    done(null, user)
  }).catch(err => {
    done(err)
  })
}))

app.get('/auth/naver', passport.authenticate('naver'))

app.get('/auth/naver/callback', passport.authenticate('naver', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

// google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  const profile_photo = profile.photos[0] ? profile.photos[0].value : null
  query.firstOrCreateUserByProvider(
    'google',
    profile.id,
    accessToken,
    profile_photo
  ).then(user => {
    done(null, user)
  }).catch(err => {
    done(err)
  })
}))

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}))

app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

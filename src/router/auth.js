// 불러오기
const query = require('../query')
// passport 작성
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const NaverStrategy = require('passport-naver').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const KakaoStrategy = require('passport-kakao').Strategy

// middleware
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const express = require('express')
// router
const router = express.Router()
// jwt발급
const oauthHandler = (req, res) => {
  const token = jwt.sign({id: req.user.id, nickname: req.user.nickname}, process.env.SECRET)
  const origin = process.env.TARGET_ORIGIN
  res.send(`<script>window.opener.postMessage('${token}', '${origin}')</script>`)
}

router.use(passport.initialize())
// 로그인창
router.get('/', (req, res) => {
  res.render('auth.pug')
})

// facebook
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => {
  const profile_photo = profile.photos[0] ? profile.photos[0].value : null
  const nickname = profile._json.name? profile._json.name : null
  query.firstOrCreateUserByProvider(
    'facebook',
    profile.id,
    nickname,
    accessToken,
    profile_photo
  ).then(user => {
    done(null, user)
  }).catch(err => {
    done(err)
  })
}))

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'manage_pages']
}))

router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), oauthHandler)

// naver
passport.use(new NaverStrategy({
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: process.env.NAVER_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  const profile_photo = profile._json.profile_image ? profile._json.profile_image : null
  const nickname = profile._json.nickname? profile._json.nickname : null
  query.firstOrCreateUserByProvider(
    'naver',
    profile.id,
    nickname,
    accessToken,
    profile_photo
  ).then(user => {
    done(null, user)
  }).catch(err => {
    done(err)
  })
}))

router.get('/naver', passport.authenticate('naver'))

router.get('/naver/callback', passport.authenticate('naver', { session: false }), oauthHandler)

// google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  const profile_photo = profile.photos[0] ? profile.photos[0].value : null
  const nickname = profile._json.displayName? profile._json.displayName : null
  query.firstOrCreateUserByProvider(
    'google',
    profile.id,
    nickname,
    accessToken,
    profile_photo
  ).then(user => {
    done(null, user)
  }).catch(err => {
    done(err)
  })
}))

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}))

router.get('/google/callback', passport.authenticate('google', { session: false }), oauthHandler)

// kakao
passport.use(new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID,
  clientSecret: process.env.KAKAO_CLIENT_SECRET,
  callbackURL: process.env.KAKAO_CALLBACK_URL
},(accessToken, refreshToken, profile, done) => {
  // 다른 passport는 thumbnai-image를 사용하므로 thumbnail-image로 변경함.
  // const profile_photo = profile._json.properties.profile_image? profile._json.properties.profile_image : null
  const profile_photo = profile._json.properties.thumbnail_image? profile._json.properties.thumbnail_image : null
  const nickname = profile.displayName? profile.displayName : null
  query.firstOrCreateUserByProvider(
    'kakao',
    profile.id,
    nickname,
    accessToken,
    profile_photo
  ).then(user => {
    done(null, user)
  }).catch(err => {
    done(err)
  })
}))

router.get('/kakao', passport.authenticate('kakao'))

router.get('/kakao/callback', passport.authenticate('kakao', { session: false }), oauthHandler)

module.exports = router

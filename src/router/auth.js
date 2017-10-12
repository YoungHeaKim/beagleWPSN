// 불러오기
const query = require('../query')
// passport 작성
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const NaverStrategy = require('passport-naver').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
// middleware
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const express = require('express')
const mw = require('../middleware')
// router
const router = express.Router()
// jwt발급
const oauthHandler = (req, res) => {
  const token = jwt.sign({id: req.user.id}, process.env.SECRET)
  const origin = process.env.TARGET_ORIGIN
  res.send(`<script>window.opener.postMessage('${token}', '${origin}')</script>`)
}

router.use(mw.insertReq)
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

router.get('/naver', passport.authenticate('naver'))

router.get('/naver/callback', passport.authenticate('naver', { session: false }), oauthHandler)

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

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}))

router.get('/google/callback', passport.authenticate('google', { session: false }), oauthHandler)

module.exports = router

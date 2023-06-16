const passport = require('passport')
const googleStrategy = require('passport-google-oauth20')
require('dotenv').config()
passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3002/auth/google/callback',
    scope: ['profile'],
    state: true
}, (accessToken, refreshToken, profile, cb) => {
    cb(null, profile)
}))
passport.serializeUser((user, cb) => {
    cb(null, user)
})
passport.deserializeUser((user, cb) => {
    cb(null, user)
})

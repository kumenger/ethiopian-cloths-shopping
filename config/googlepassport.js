// const passport = require("passport");
const Google = require("../models/Google");
require('dotenv').config()
const GoogleStrategy = require("passport-google-oauth20").Strategy;
module.exports = (passport) => {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3002/auth/google/callback',
        passReqToCallback : true
       
    }, async (request,accessToken, refreshToken, profile, done) => {
      try {
          console.log("user profile is: ", profile);
          return done(null,profile)
      } catch (error) {
        return done(error,false)
      }
      
    }))
    passport.serializeUser( (user, done) => {
      done(null, user)
   })

   passport.deserializeUser((user, done) => {
     done (null, user)
   })
}

const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(new GoogleStrategy({
    clientID: '275812907413-q57kvr3a97kmsm4bg5tehlg7jorue6g1.apps.googleusercontent.com',
    clientSecret: 'zq7EuweV2H2VNA2ANfcVuClu',
    callbackURL: 'http://localhost:5000/oauth/google/callback',
  }, ((accessToken, refreshToken, profile, done) => {
    // console.log(accessToken);

    //여기서 첫로그인인지 판별해서 insert 해주거나, 토큰 만들어서 main으로 redirect

    // console.log(profile);
    done(null, profile);
  })));
};

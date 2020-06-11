import { getConnection } from 'typeorm';
import User from './entity/User';

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
  }, (async (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  })));
};

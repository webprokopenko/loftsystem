var passport = require('passport');
var passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');

var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

var params = {
  secretOrKey: 'secret',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  'loginUsers',
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
      .then(user => {
        if (user.validPassword(password)) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch(err => {
        console.log(err);
        done(err);
      });
  })
);

var strategy = new Strategy(params, function(payload, done) {
  const User = mongoose.model('users');
  User.find({ id: payload.id })
    .then(user => {
      if (user) {
        return done(null, {
          id: user.id
        });
      } else {
        return done(new Error('User not found'), null);
      }
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
});

passport.use(strategy);
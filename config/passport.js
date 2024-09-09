const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ where: { username: username } })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        console.log('User authenticated');
        return done(null, user);
      })
      .catch(err => done(err));
  }
));

passport.serializeUser(function(user, done) {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findByPk(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

module.exports = passport;
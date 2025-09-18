const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('../models');

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ where: { username: username } })
      .then(user => {
        if (!user) {
          // User not found
          console.log('User not found:', username);
          return done(null, false, { message: 'Incorrect username.' });
        }

        // Found user, log details
        console.log('Found user:', user.username, 'DB hash length:', user.password.length, 'DB hash:', user.password); // Should show ~60 chars and full hash
        

        // Compare input password with stored hash
        bcrypt.compare(password, user.password, (err, isMatch) => {
          console.log('Compare result:', isMatch, 'Error:', err); // Log check
          if (err) return done(err);
          if (isMatch) {
            console.log('User authenticated');
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password.' });
          }
        });
      })
      .catch(err => done(err));
  }
));

passport.serializeUser(function (user, done) {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findByPk(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

module.exports = passport;

var express = require('express');
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Signup Page
router.get('/signup', function (req, res) {
  res.render('signup', { title: 'Signup', user: req.user });
});

// Signup POST Request
router.post('/signup', async function (req, res, next) {
  try {
    const { firstname, lastname, username, password } = req.body;
    const fullName = `${firstname} ${lastname}`;

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 15);
    const user = await User.create({ fullName, username, password: hashedPassword, role: 'customer' });
    req.login(user, function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  } catch (err) {
    next(err);
  }
});

// Login Page
router.get('/login', function (req, res) {
  res.render('login', { title: 'Login', user: req.user });
});

// Login POST Request
router.post('/login', passport.authenticate('local', {
  successRedirect: '/vehicles',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

// Logout Route
router.get('/logout', function (req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;

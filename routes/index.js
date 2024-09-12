var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    user: null // Currently, no user is passed to the view
  });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'Express',
    user: null // No user is passed on the login page
  });
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  res.render('signup', {
    title: 'Express',
    user: null // No user is passed on the signup page
  });
});

module.exports = router;

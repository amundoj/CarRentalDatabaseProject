require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('./config/passport');
var sequelize = require('./config/database');

var indexRouter = require('./routes/index');
var vehiclesRouter = require('./routes/vehicles');
var coloursRouter = require('./routes/colours');
var typesRouter = require('./routes/types');
var authRouter = require('./routes/auth');

var app = express();

// Drop and sync database before starting the app
async function resetAndSyncDatabase() {
  const { populateDatabase } = require('./populateDatabase');
  try {
    await sequelize.sync({ force: true });
    await populateDatabase();
    console.log('Database reset and sync completed.');
  } catch (err) {
    console.error('Failed to reset and sync database:', err);
  }
}

resetAndSyncDatabase().then(() => {
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(session({ secret: 'your secret key', resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/', indexRouter);
  app.use('/auth', authRouter);
  app.use('/vehicles', vehiclesRouter);
  app.use('/colours', coloursRouter);
  app.use('/types', typesRouter);

  var PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });
});

module.exports = app; 

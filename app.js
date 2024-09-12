require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('./config/passport');
var sequelize = require('./config/database');

// Route imports
var indexRouter = require('./routes/index');
var vehiclesRouter = require('./routes/vehicles');
var coloursRouter = require('./routes/colours');
var typesRouter = require('./routes/types');
var authRouter = require('./routes/auth');

var app = express();

// Function to reset and sync the database, including population
async function resetAndSyncDatabase() {
  const { populateDatabase } = require('./populateDatabase');
  try {
    await sequelize.sync({ force: true });  // Force sync to reset database
    await populateDatabase();  // Populate the database with initial data
    console.log('Database reset and sync completed.');
  } catch (err) {
    console.error('Failed to reset and sync database:', err);
  }
}

// Start the reset and sync process, then initialize the server
resetAndSyncDatabase().then(() => {
  // Set up view engine
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // Middleware setup
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(session({ secret: 'your secret key', resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Define routes
  app.use('/', indexRouter);
  app.use('/auth', authRouter);
  app.use('/vehicles', vehiclesRouter);
  app.use('/colours', coloursRouter);
  app.use('/types', typesRouter);

  // Set the port
  var PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Handle 404 errors
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // Error handler
  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });
});

module.exports = app;

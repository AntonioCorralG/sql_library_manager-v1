var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./models/index').sequelize;



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


(async () => {
  try {
  await sequelize.authenticate();
  console.log("Connection Established");
  } catch (error) {
    console.error("Unable to Connect")
  }

  try {
    await sequelize.sync();
    console.log('Synced');
  } catch (error) {
    console.error('Sync Error - unable to sync', error);
  }

}) ();

//404 error handling 
app.use(( req, res, next) => {
  const err = new Error;
  err.status = 404;
  err.message = `Cannot find the requested webpage`;
  // res.status(404).render('page-not-found');
  next(err)
  });

//global error handling
  app.use((err, req, res, next) => {

    if (err.status === 404) {
      res.status(404).render('page-not-found', { err } )
    } else {
    err.message = err.message || "There was a server error!";
    res.locals.error = err;
    res.status(err.status || 500).render('error', { err })
    console.log(`You have hit a ${err.status} error!`);
    // res.send(`Error Code: ${err.status} : ${err.message}`);
    }
  });

module.exports = app;

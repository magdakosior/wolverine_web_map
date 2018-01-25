var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;

var items = require('./routes/items');
var app = express();

// view engine setup *use this only if running api seperately
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//for prod use ng build for client then
app.use(express.static(path.join(__dirname, '../../dist/client')));

app.use('/api', items);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  // for prod use
  res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
});

/*
exec('"C:/..path to executable or bat file../Wolverine Map-win32-x64/Wolverine Map.exe"')
  .on('error', function(error) {
    console.log("ERROR: DETAILS: " + error);
  })
  .on('close', function(code) {
    console.log("SUCCESS: CODE: " + code);
    process.exit(code);
  })
  .on('exit', function(code) {
    console.log("EXIT: CODE: " + code);
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

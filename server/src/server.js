var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var items = require('./routes/items');
var app = express();

// view engine setup *use this only if running api seperately
/*
const PORT = process.env.PORT || 3000
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, '../../client/src')));
//for prod use ng build for client then
app.use(express.static(path.join(__dirname, '../../dist/client')));

//app.use('/', items);
app.use('/api', items);
//app.use('/api/itemsall', items);
//app.use('/api/items/:id', items);


/**/
// Catch all other routes and return the index file
app.get('*', (req, res) => {
  //res.sendFile(path.join(__dirname, '../../client/src/index.html'));
  // for prod use
  res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//app.listen(PORT, () => console.log(`App listening on *:${PORT}`))

module.exports = app;

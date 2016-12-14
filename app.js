var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var add_flash = require('add-flash');
var cookieSession = require('cookie-session');
var expressNunjucks = require('express-nunjucks');
var nunjucks = require('nunjucks');
var nunjucksFilter = require('./common/nunjucksFilter');
var mongoose = require('mongoose');
// var flash = require('express-flash');

var index = require('./routes/index');
// var users = require('./routes/users');
mongoose.Promise = global.Promise;

var app = express();
var db = mongoose.connect('mongodb://localhost/oam');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'nunjucks');


var isDev = app.get('env') === 'development';

var njk = expressNunjucks(app, {
  watch: isDev,
  noCache: isDev,
  filters: nunjucksFilter
});

var nunjucks_env = new nunjucks.Environment();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cookieSession({
  name: 'sessionKamarMedis',
  keys: ['wfn35qfe2hf9823nwis', 'sf932inis7f510046br3hfj97yb65hoqm8hf6h9jf095w8nf']
}));

app.use(flash());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(add_flash());

app.use('/', index);
// app.use('/users', users);

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

module.exports = app;

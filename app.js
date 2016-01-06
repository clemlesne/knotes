require('newrelic');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var compress = require('compression');
var debug = require('debug')('knotes:app');

__basedir = path.resolve(__dirname);
__config = require(path.join(__basedir, 'config', (process.env.NODE_ENV || 'development') + '.json'));

var flashAddMessage = require(path.join(__basedir, 'middlewares', 'flashMessages.js'));
var userSet = require(path.join(__basedir, 'middlewares', 'userSet.js'));
var viewResolver = require(path.join(__basedir, 'middlewares', 'viewResolver.js'));

var app = express();

app.set('case sensitive routing', true);
app.set('x-powered-by', false);

// uncomment after placing your favicon in /public
app.use(compress());
app.use(favicon(path.join(__basedir, 'public', 'img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(__config.cookieSecret));
app.use(express.static(path.join(__basedir, 'public')));

// DataBase config
require(path.join(__basedir, 'databases', 'init.js')).init(function(mongoose, redis) {
  console.log('All databases are ready.');

  __db_mongoose = mongoose;
  __db_redis = redis;

  // Session storage config
  var session = require('express-session');
  var RedisStore = require('connect-redis')(session);

  app.use(session({
    name: 'ssid',
    store: new RedisStore({
      client: __db_redis,
      ttl: 14 * 24 * 60 * 60, // 14 days
      db: 1,
      prefix: ''
    }),
    secret: __config.sessionSecrets,
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport config
  passport = require(path.join(__basedir, 'passport', 'init.js'))(passport);

  // Middlewares init
  app.use(flashAddMessage);
  app.use(userSet);
  app.use(viewResolver);

  var index = require(path.join(__basedir, 'routes', 'index.js'));
  var auth = require(path.join(__basedir, 'routes', 'auth.js'))(passport);
  var account = require(path.join(__basedir, 'routes', 'account.js'));
  var notes = require(path.join(__basedir, 'routes', 'notes.js'));

  app.use('/', index);
  app.use('/auth', auth);
  app.use('/account', account);
  app.use('/notes', notes);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Error Handlers

  // Development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {

    app.use(function(err, req, res, next) {
      console.log('Error > ' + err);

      res.status(err.status || 500);
      res.doRender(path.join('pages', 'error'), {
        message: err.message,
        error: err
      });
    });
  }

  // Production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.doRender(path.join('pages', 'error'), {
      message: err.message,
      error: null
    });
  });
});

module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('cookie-session');
var bcrypt = require('bcrypt');

var auth = require('./routes/auth');
var routes = require('./routes/routes');
var db = require('./pool.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  keys: [process.env.SECRET || 'h0r1z0n5']
}));

// Passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.query(`SELECT * FROM users WHERE id = $1`, [id]).then(user => {
    done(null, user.rows[0]);
  }).catch(err => {
    done(err, null);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  console.log("LocalStrategy called");
  db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(user => {
      if (user.rows.length === 0) {
        return done(null, false);
      } else {
        return bcrypt.compare(password, user.rows[0].password, function(err, res) {
          if (err) {
            return done(err,false);
          } else if (res) {
            return done(null, user.rows[0]);
          }
        });
      }
    }).catch((err) => {
      return done(err);
    });
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', auth(passport, db));
app.use('/', routes(db));

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
  res.locals.error = req.app.get('env') === 'development'
    ? err
    : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

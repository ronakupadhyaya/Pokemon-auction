var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('cookie-session');

var auth = require('./routes/auth');
var routes = require('./routes/routes');
var db = require('./pool.js');

var app = express();
var exphbs = require('express-handlebars')

// view engine setup
app.engine('hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({keys: [process.env.SECRET || 'h0r1z0n5']}))

// Passport
passport.serializeUser(function(user, done) {
  // YOUR CODE HERE
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // YOUR CODE HERE
  db.query(`SELECT id from users WHERE id = $1;`, [id])
    .then((result) => {
      let user = result.rows;
      if(!user){
        done(false, false);
        return;
      }
      done(false, user);
    })
    .catch((err) => {
      done(err);
      console.log('Error: ' + err);
    });
});

passport.use(new LocalStrategy(function(username, password, done) {
  // YOUR CODE HERE
  db.query(`SELECT username FROM users WHERE username = '$1';`, [username])
    .then((result) => {
      console.log('User', result);
      let user = result.rows;
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    })
    .catch((err) => {
      if (err) { return done(err); }
    });
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', auth(passport));
app.use('/', routes());

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

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('cookie-session');
const util = require('util');

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
app.use(bodyParser.urlencoded({ extended: true }));
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
  db.query(`select * from users where id = $1;`, [id])
  .then(function(result){
    done(null, result)
  })
  .catch(function(err){
    console.log('there was an error', err);
  })
})
 
// passport strategy;
passport.use(new LocalStrategy(function(username, password, done) {
  if (! util.isString(username)) {
      done(null, false, {message: 'User must be string.'});
      return;
    }
  // find the user with the given username

    db.query(`select id, username, pword from users where 
    username = $1 and pword = $2;`, [username, password])
    .then(function(result){
      done(null, result.rows[0])
    })
    .catch(function(err){
      console.log('there was an error', err)
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', auth(passport, db));
app.use('/', routes(db));

app.get('/profile', (req, res)=>{
  const allowed = ['id', 'street', 'city', 'state', 'zipcode', 'country', 'username', 'email', 'phone']
  const filtered = Object.keys(req.user.rows[0]).filter(key => allowed.includes(key)).reduce((obj, key)=>{obj[key] = req.user.rows[0][key];
  return obj}, {});
  res.render('profile', {user: filtered})
})

app.post('/profile', (req, res)=>{
  db.query(`select pword from users where id = ${req.user.rows[0].id};`)
    .then(function(result){
      return result.rows[0].pword
    })
    .then(function(result1){
      if (result1 === req.body.pword){
        db.query(`update users
        set street=$1, city=$2, state=$3, zipcode=$4, country=$5, email=$6, phone=$7
        where id=${req.user.rows[0].id}
        ;`, [req.body.street, req.body.city, req.body.state, req.body.zipcode, req.body.country, req.body.email, req.body.phone])
          .then(function(result){
            res.redirect('/dashboard')
          })
          .catch(function(error){
            console.log('there was an error', error)
          });
      } else {
        throw `the entered password is incorrect`
      }
    })
    .catch(function(error){
      console.log('there was an error', error)
})
})

app.get('/auction/new', (req, res)=>{
  res.render('newAuction', {})
})

app.post('/auction/new', (req, res)=>{
  var now = new Date()
  var pokeId;
  db.query(`select id from pokemon where name_poke=$1 limit 1;`, [req.body.pokemon])
  .then(function(result1){
    return result1.rows[0].id
  })
  .then(function(result){
    var pokeId = result
    db.query(`insert into auction
    (id, user_id, poke_id, opening_bid, reserve_price, auction_created, auction_start, auction_end, descrip, status, ship_address)
    values
    (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ;`, [req.user.rows[0].id, result, req.body.opening_bid, req.body.reserve_price, now, req.body.auction_start, req.body.auction_end, req.body.descrip, 'inactive', req.body.ship_address])
  })
  .catch(function(error){
    console.log('there was an error', error)
  })
  res.redirect(`/auction/${pokeId}`);
})

// join users u on (u.id = a.user_id)
// join auction_bids b on (b.aunction_id = a.id) 

app.get('/auction/:id', (req, res)=>{
  db.query(`select * from 
  auction a join pokemon p on (a.poke_id = p.id)
  where a.id = $1;
  `, [req.params.id])
  .then(function(result){
    console.log(result.rows[0])
    res.render('auction', {auction: result.rows[0]})
  })
  .catch(function(error){
    console.log('there was an error', error)
  })
})

app.get('/auction/delete/:id', (req, res)=>{
  db.query(`delete from auctions where id=${req.params.id}`)
  .then(function(result){
    console.log('auction successfully deleted!')
  })
  .catch(function(error){
    console.log('there was an error', error);
  })
}

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




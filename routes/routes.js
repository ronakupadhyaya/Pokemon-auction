var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  // YOUR CODE HERE
  router.use(function(req, res, next) {
    if (! req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  router.get('/dashboard', (req, res, next) => {
    console.log('get dashboard.');
    res.render('dashboard');
  })

  router.get('/profile', (req, res, next) => {
    console.log('get profile.');
    res.render('profile', {user: req.user});
  })

  router.get('/editprofile', (req, res, next) => {
    console.log('user: ', req.user);
    res.render('editprofile', {user: req.user});
  })

  router.get('/enterpassword', (req, res, next) => {
    console.log('entering the password.');
    res.render('enterpassword', {password: req.user.password});
  })

  router.post('/samepassword', (req, res, next) => {
    console.log('testing if passwords are the same.');
    if(req.user.password === req.body.password){
      console.log('passwords match, redirecting.');
      res.redirect('/editprofile');
    }  else {
      console.log('passwords do not match.');
      res.redirect('/profile');
    }
  })

  router.post('/update', (req, res, next) => {
    console.log('req.body: ', req.body);
    console.log('req.user: ', req.user);
    db.query(`UPDATE users set username = $1, password = $2, email = $3, phone = $4, street = $5, city = $6, state = $7, country = $8, postal = $9 where username = $10`,
       [req.body.username, req.body.password, req.body.email, req.body.phone, req.body.street, req.body.city, req.body.state, req.body.country, req.body.zipcode, req.user.username])
       .then(() => res.redirect('/profile'))
       .catch(err => console.log('error updating', err))
    // need to update sql and then
    // redirect to profile
  })

  router.post('/auction/new', (req, res, next) => {
    console.log('req.body: ', req.body);
    db.query(`INSERT into auctions (pokemon_id, r_price,f_location,description,length) values ($1, $2, $3, $4, $5)`,
       [req.body.pokemon_id, req.body.reserve_price, req.body.shipping, req.body.description, req.body.length])
       .then(() => {
         return db.query(`select * from auctions where id >= all (select id from auctions)`)
       })
       .then((result) => {
         console.log('result id', result.rows[0].id);
         res.redirect('/auction/' + result.rows[0].id)
       })
       .catch(err => console.log('error updating', err))
  })

  router.get('/auction/new', (req, res, next) => {
    db.query(`select name, id from pokemon`)
    .then(result => {
      console.log('result: ', result);
      res.render('newAuction', {pokemon: result.rows})
    })
    .catch(err => console.log('error loading dropdown', err))
  })

  router.get('/auction/:id', (req, res, next) => {
    let pokeInfo = {};
    let bidInfo = {};

    console.log('got to auction id.', req.params.id);
    db.query(`select * from auctions a left outer join pokemon p
               on p.id = a.pokemon_id where a.id=$1`, [req.params.id])
    .then(result => {
      console.log('result pokemon: ', result.rows[0]);
      pokeInfo = result.rows[0];
    })
    .catch((err) => {
      console.log("error joining auction and pokemon", err);
    })

    db.query(`select * from auctions a left outer join bids b
              on a.id = b.inAuction where b.amount >= all(select amount from bids)`)
              .then(result => {
                console.log('result bid: ', result.rows);
                if(result.rows > 0){
                  bidInfo = result.rows[0];
                  res.render('auction', {pokeInfo, bidInfo})
                }  else {
                  console.log('no bids.');
                  res.render('auction', {pokeInfo})
                }
              })
              .catch(err => "error joining auction and bids")
  })

  router.post('/delete/:id', (req, res, next) => {
    db.query(`delete from auctions where id = $1`, [req.params.id])
    .then(() => {
      res.redirect('/profile');
    })
    .catch((err) => console.log('error ', err))
  })



  return router;
}

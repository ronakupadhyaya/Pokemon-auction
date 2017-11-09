var express = require('express');
var db = require('../pool.js');
var router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  router.get('/profile', (req, res, next) => {
    res.render('profile', {name: req.user})
  });

  router.get('/newauction', (req, res, next) => {
    db.query(`SELECT * FROM pokemon_catalog`).then((result) =>{
    console.log("FOR AUCTION", result)
    res.render('auction', {name: req.user, pokemon1: result.rows})}).catch((err) => console.log(err))
  });

  router.post('/createauction', (req, res, next) => {
    console.log('CREATEAUCTIONNN', req.body);
    console.log(req.user);
    db.query(`SELECT * FROM pokemon_catalog WHERE id = $1`, [req.body.name]).then((pokemon) => {
      db.query(`INSERT INTO create_auction (owner_user_id, pokemon_name, pokemon_type, image_url, starting_bid, reserve, shipping_location, auction_length, description, pokemon_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, $10) RETURNING id`, [req.user.id, pokemon.rows[0].name, pokemon.rows[0].type, pokemon.rows[0].image_url, req.body.starting_bid, req.body.reserve, req.body.street, req.body.length, req.body.description, pokemon.rows[0].id])
      .then((result) => {
        console.log('auction created!!')
        res.redirect(`/auction/${result.rows[0].id}`)})
  })
    .catch((err) => console.log('there was an err!', err))
  });

  router.get('/auction/:id', (req, res, next) => {
    db.query(`SELECT * FROM create_auction WHERE id = $1`, [req.params.id]).then((result) => {
      console.log('THIS.IS.SPARTAA', result.rows[0]);
      res.render('sauction', {pokemon: result.rows[0]})
    }).catch((err) => console.log('e', err))
  });

  router.post('/update', (req, res, next) => {
    db.query(`SELECT * FROM user_db WHERE username = $1`, [req.body.username])
    .then((user) => {
    if(req.body.password1 === user.rows[0].password){
      db.query(`UPDATE user_db SET username = $1, email = $2, phone = $3, street_address = $4, city = $5, state = $6, country = $7, zipcode = $8 WHERE username = $9`, [req.body.username, req.body.email, req.body.phone, req.body.street, req.body.city, req.body.state, req.body.country, req.body.zip, user.rows[0].username])
      .then((result) => {
        console.log(result);
        res.redirect('/dashboard')
      })
      }
    else{
      console.log('errrrrrrrrr didnt update brah');
      res.redirect('/profile')
    }
  }).catch((err) => console.log('err updating user info', err))
  });





  router.use(function(req, res, next) {
    if (! req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });


  // YOUR CODE HERE

  return router;
}

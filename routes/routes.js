var express = require('express');
var router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  // YOUR CODE HERE
  router.get('/dashboard', (req, res, next) => {
    res.render('dashboard');
  });

  router.get('/profile', (req, res, next) => {
    console.log(req.body.user);
    db.query(`SELECT * FROM users WHERE username = $1;`, [req.body.user])
      .then((result) => {
        res.render('profile', {
          username: result.rows[0].username,
          email: result.rows[0].email,
          phone_number: result.rows[0].phone_number,
          street_address: result.rows[0].street_address,
          city: result.rows[0].city,
          state: result.rows[0].state,
          zipcode: result.rows[0].zipcode
        });
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
  });

  router.post('/profile', (req, res, next) => {
    db.query(`UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4, street_address = $5,
      city = $6, state = $7, zipcode = $8;`, [req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.street_address, req.body.city, req.body.state, req.body.zipcode])
      .then((result) => {
        console.log(result);
        if (result) {
          res.render('profile');
        }
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
  });

  router.get('/auction/new', (req, res, next) => {
    res.render('newAuction');
  });

  router.post('/auction/new', (req, res, next) => {
    db.query(`INSERT INTO users (fk_seller, fk_pokemon, start_date, opening_bid, reserve_price, duration, shipping_from, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`, [req.body.user, req.body.pokemon_name, req.body.start_date, req.body.opening_bid, req.body.reserve_price, req.body.duration, req.body.shipping_from, req.body.description])
      .then((result) => {
        if (result) {
          res.redirect(`/auction/:${result.rows[0].auction_id}`);
        }
      })
      .catch((err) => {
        console.log('Failed to save auction', err);
      });
  });

  router.get('/auction/:id', (req, res, next) => {
    db.query(`SELECT * FROM auction WHERE auction_id = $1;`, [req.query.id])
      .then((result) => {
        if (result.rows.length > 0) {
          db.query(`SELECT * FROM pokemon WHERE name = $1;`, [result.rows[0].fk_pokemon])
            .then((pokemon) => {
              if (pokemon.rows.length > 0) {
                res.render('auction', {
                  pokemon: pokemon.rows[0].whos_that_pokemon,
                  pokemon_type: pokemon.rows[0].type,
                  pokemon_name: pokemon.rows[0].name,
                  seller: result.rows[0].fk_seller,
                  description: result.rows[0].description,
                  start_date: result.rows[0].start_date,
                  opening_bid: result.rows[0].opening_bid,
                  reserve_price: result.rows[0].reserve_price,
                  duration: result.rows[0].duration,
                  shipping_from: result.rows[0].shipping_from
                });
              } else {
                console.log('Pokemon does not match');
                res.redirect('/auction/new');
              }
            });
        } else {
          console.log('Auction matches');
          res.redirect('/auction/new');
        }
      })
      .catch((err) => {
        console.log('Could not find this auction', err);
      });
  });

  return router;
};

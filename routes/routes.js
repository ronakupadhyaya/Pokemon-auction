var express = require('express');
var router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  router.use((req, res, next) => {
    if (! req.user) {
      res.redirect('/login');
    } else {
      console.log(req.user)
      next();
    }
  });

  router.get('/dashboard', (req, res, next) => {
    res.render('dashboard');
  });

  router.get('/auction/new', (req, res, next) => {
    db.query('select * from pokemon')
    .then(result => {
      res.render('newAuction', {pokemon: result.rows});
    })
    .catch(err => {
      console.log(err);
    });
  });

  router.post('/auction/new', (req, res, next) => {
    db.query('insert into auctions (fk_users, fk_pokemon, opening_bid, reserve_price, duration, shipping_location, description, creation) values ($1, $2, $3, $4, $5, $6, $7, 00000)',
    [req.user.id, req.body.pokemon, req.body.opening_bid, req.body.reserve_price, req.body.duration, req.body.shipping_location, req.body.description])
    .then(() => {
      console.log('created auction');
      res.redirect(`/dashboard`);
    })
    .catch(err => {
      console.log(err);
    });
  });

  router.get('/auction/:id', (req, res, next) => {
    db.query('select * from auctions a join pokemon p on a.fk_pokemon = p.id where a.id = $1', [req.params.id])
    .then(result => {
      console.log(result);
      if (req.user.id === result.rows[0].fk_users){
        res.render('auction', { auction: result.rows[0], editable: true});
      } else {
        res.render('auction', { auction: result.rows[0]});
      }
    })
    .catch(err => {
      console.log(err);
    });
  });

  router.get('/delete/:auctionid', (req, res, next) => {
    db.query('delete from auctions where id = $1', [req.params.auctionid])
    .then(() => {
      console.log('deleted');
    })
    .catch(err => {
      console.log('Error: ', err);
    })
  })

  return router;
};

var express = require('express');
var router = express.Router();

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

  router.get('/dashboard', (req,res,next) => {
    console.log(req.user);
    db.query("SELECT * from auctions")
      .then((auction) => {
        console.log(auction.rows);
        res.render('dashboard', {user: req.user, auctions: auction.rows});
      })
      .catch((err) => {
        console.log('error finding auctions for dashboard', err);
      });
  });

  router.get('/profile', (req,res,next) => {
    res.render('profile', {profile: req.user});
  });

  router.post('/profile', (req, res, next) => {
    db.query("SELECT * FROM users WHERE id = $1", [req.user.id])
      .then((user) => {
        // console.log('user is: ', user);
        if(req.body.confirmpassword === user.rows[0].password){
          db.query("UPDATE users SET username = $2, password = $3, email = $4, phone = $5, street_address = $6, city = $7, state = $8, country = $9, postal_code = $10 WHERE id = $1", [user.rows[0].id, req.body.username, req.body.password, req.body.email, req.body.phone, req.body.street, req.body.city, req.body.state, req.body.country, req.body.postal])
            .then((user) => {
              // console.log(req.user);
              res.redirect('/profile');
            })
            .catch((err) => {
              console.log('error updating user in database', err);
            });
        } else {
          res.send('incorrect password');
        }
      })
      .catch((err)=> {
        console.log('error finding user when updating profile', err);
      });
  });

  router.get('/auction/new', (req,res,next) => {
    db.query("SELECT * FROM pokemon WHERE id NOT IN (SELECT pokemon_id FROM auctions) ORDER BY id")
    .then((pokemon) => {
      // console.log(pokemon.rows);
      res.render('newAuction', {pokemon: pokemon.rows});
    })
    .catch((err) => {
      console.log('error finding pokemon', err);
    });
  });

  router.post('/auction/new', (req, res, next) => {
    // console.log('pokemon id is', req.body.pokemon);
    db.query("SELECT * FROM pokemon WHERE id = $1", [req.body.pokemon])
      .then((pokemon) => {
        // console.log('pokemon name', pokemon.rows[0].name);
        db.query("INSERT INTO auctions (pokemon_name, starting_bid, reserve_price, auction_length, shipping_from, description, pokemon_id, status, creator_id) VALUES ($2, $3, $4, $5, $6, $7, $8, 'active', $1)", [req.user.id, pokemon.rows[0].name, req.body.starting_bid, req.body.reserve_price, req.body.length, req.body.shipping, req.body.description, req.body.pokemon])
        .then((insertAuction) => {
          db.query("SELECT * FROM auctions WHERE pokemon_id = $1", [req.body.pokemon])
            .then((auction) => {
              // console.log('auction is: ', auction);
              res.redirect(`/auction/${auction.rows[0].id}`);
            })
            .catch((err) => {
              console.log('error grabbing auction id', err);
            });
        })
        .catch((err) => {
          console.log('error creating new auction', err);
        });
      })
      .catch((err) => {
        console.log('error finding pokemon', err);
      });
  });

  router.get('/auction/:id', (req,res,next) => {
    var status = false;
    var userStatus = false;
    // var hasBids = false;
    db.query("SELECT * from auctions WHERE id = $1", [req.params.id])
      .then((auction) => {
        if(auction.rows[0].status === 'active') {
          status = true;
        }
        if(auction.rows[0].creator_id === req.user.id){
          userStatus = true;
        }
        db.query("SELECT * from pokemon WHERE id = $1", [auction.rows[0].pokemon_id])
          .then((pokemon) => {
            db.query("SELECT max(amount) from bids WHERE auction_id = $1", [auction.rows[0].id])
              .then((bid) => {
                console.log('bid is: ', bid);
                res.render('auction', {auction: auction.rows[0], pokemon: pokemon.rows[0], user: userStatus, status: status, currentBid: bid.rows[0].max});
              })
              .catch((err) => {
                console.log('error finding max bid', err);
              });
          })
          .catch((err) => {
            console.log('error finding pokemon for auction', err);
          });
      })
      .catch((err) => {
        console.log('error finding auction based on id', err);
      });
  });

  router.post('/auction/:id', (req, res, next) => {
    db.query("SELECT * from auctions WHERE id = $1", [req.params.id])
      .then((auction) => {
        if(auction.rows[0].status === 'active' && req.user.id === auction.rows[0].creator_id) {
          db.query("UPDATE auctions SET starting_bid = $1, reserve_price = $2, shipping_from = $3, description = $4, auction_length = $5 WHERE id = $6", [req.body.starting_bid, req.body.reserve_price, req.body.shipping, req.body.description, req.body.length, auction.rows[0].id])
            .then((updateAuction) => {
              res.redirect(`/auction/${req.params.id}`);
            })
            .catch((err) => {
              console.log('error updating auction', err);
            });
        } else {
          res.send('you cannot update this auction');
        }
      })
      .catch((err) => {
        console.log('error finding auction to update', err);
      });
  });

  router.post('/auction/delete/:id', (req, res, next) => {
    db.query("SELECT * from auctions WHERE id = $1", [req.params.id])
      .then((auction) => {
        if(auction.rows[0].status === 'active' && req.user.id === auction.rows[0].creator_id) {
          db.query("DELETE FROM auctions WHERE id = $1", [req.params.id])
            .then((deleteAuction) => {
              res.redirect('/dashboard');
            })
            .catch((err) => {
              console.log('error deleting auction', err);
            });
        } else {
          res.send('you cannot delete this auction');
        }
      })
      .catch((err) => {
        console.log('error finding auction to delete', err);
      });
  });

  router.post('/auction/bid/:id', (req, res, next) => {
    console.log('here');
    db.query("SELECT * from auctions WHERE id = $1", [req.params.id])
      .then((auction) => {
        if(auction.rows[0].status === 'active' && req.user.id!==auction.rows[0].creator_id) {
          db.query("INSERT INTO bids (user_id, auction_id, amount) VALUES ($1, $2, $3)", [req.user.id, auction.rows[0].id, req.body.bid])
            .then((bid) => {
              res.redirect(`/auction/${req.params.id}`);
            })
            .catch((err) => {
              console.log('error creating new bid', err);
            });
        }
      })
      .catch((err) => {
        console.log('error finding auction to make bid');
      });
  });

  return router;
};

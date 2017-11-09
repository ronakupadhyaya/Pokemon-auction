var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  router.use(function(req, res, next) {
    if (! req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  router.post('/auction/bid/:id', (req, res, next) => {
    db.query(`INSERT INTO bid VALUES (DEFAULT, $1,$2,$3)`, [req.user.id, req.params.id, req.body.amount])
    .then(() => {
      res.redirect('/dashboard');
    })
    .catch(e => console.log('Error bidding', e));
  });

  router.post('/auction/delete/:id', (req, res, next) => {
    db.query(`SELECT * FROM auction WHERE id = $1`, [req.params.id])
    .then((auction) => {
      db.query(`DELETE FROM watches WHERE fk_users = $1, fk_auctions = $2;`, [req.user.id, auction.rows[0].id])
      .catch((e) => console.log("watches",e));
      return auction;
    })
    .then((auction) => {
      db.query(`DELETE FROM auction WHERE id = $1`, [auction.rows[0].id])
      .catcn((e) => console.log("deleting auction failed", e));
    })
    .catch((e) => console.log("fk_users",e));
  });

  router.post('/auction/edit/:id', (req, res, next) => {

    db.query(`UPDATE auction SET
      fk_pokemon = $1,
      opening_bid = $2,
      reserve_price = $3,
      street = $4,
      city = $5,
      state = $6,
      zipcode = $7,
      description = $8,
      start_date = $9,
      start_time = $10,
      end_date = $11,
      end_time = $12
      WHERE id = $13;`,
      [req.body.pokemon,
        req.body.opening_bid,
        req.body.reserve_price,
        req.body.street,
        req.body.city,
        req.body.state,
        req.body.zipcode,
        req.body.description,
        req.body.start_date,
        req.body.start_time,
        req.body.end_date,
        req.body.end_time,
        req.params.id
      ])
      .then(() => {
        res.redirect('/dashboard');
      })
      .catch((error) => {
        console.log(error);
        var newErr1 = new Error('Wrong auction info');
        newErr1.status = 403;
        next(newErr1);
      });
    });

    router.get('/dashboard', (req, res) => {
      db.query(`SELECT a.id AS a_id, * FROM auction a JOIN pokemon p ON p.id=a.fk_pokemon WHERE a.fk_users=$1;`, [req.user.id])
      .then((auctions) => {
        db.query(`SELECT * FROM pokemon;`)
        .then((pokemon) => {
          db.query(`SELECT a.id AS au_id, * FROM auction a JOIN pokemon p ON p.id=a.fk_pokemon WHERE a.fk_users != $1;`, [req.user.id])
          .then((otherAuction) => {
            let correctDate = auctions.rows.map((row) => {
              row.start_date = row.start_date.toISOString().slice(0, 10);
              row.end_date = row.end_date.toISOString().slice(0, 10);
              return row;
            });
            let correctDate1 = otherAuction.rows.map((row) => {
              row.start_date = row.start_date.toISOString().slice(0, 10);
              row.end_date = row.end_date.toISOString().slice(0, 10);
              return row;
            });
            res.render('dashboard', {auctions: correctDate, pokemon: pokemon.rows, otherAuction: correctDate1});
          });
        });
      })
      .catch((e) => console.log(e));
    });

    router.get('/profile', (req, res) => {
      res.render('profile', {
        user: req.user
      });
    });

    router.get('/auction/new', (req, res, next) => {
      db.query(`SELECT * FROM pokemon`)
      .then((pokemon) => {
        res.render('newAuction', {pokemon: pokemon.rows});
      })
      .catch((err) => {
        var newErr4 = new Error('Cannot get pokemon');
        newErr4.status = 405;
        next(newErr4);
      })
    });

    router.post('/auction/new', (req, res, next) =>{
      db.query(`INSERT INTO auction VALUES
        (DEFAULT,
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13);`,
          [req.body.pokemon,
            req.user.id,
            req.body.opening_bid,
            req.body.reserve_price,
            req.body.street,
            req.body.city,
            req.body.state,
            req.body.zipcode,
            req.body.description,
            req.body.start_date,
            req.body.start_time,
            req.body.end_date,
            req.body.end_time
          ])
          .then(() => {
            db.query(`SELECT * FROM auction WHERE fk_users = $1`, [req.user.id])
            .then((auction) => {
              db.query(`INSERT INTO watches VALUES (DEFAULT, $1, $2)`, [req.user.id, auction.rows[0].id])
              .catch((e) => console.log("watches",e));
            }).catch((e) => console.log("fk_users",e));
          })
          .then(() => {
            res.redirect('/dashboard');
          })
          .catch((error) => {
            console.log(error);
            var newErr1 = new Error('Wrong auction info');
            newErr1.status = 403;
            next(newErr1);
          });
        });

        router.post('/profile', (req, res, next) => {
          bcrypt.compare(req.body.password, req.user.password, function(err, result) {
            if(result){
              db.query(`UPDATE users SET
                name_first = $1,
                name_last = $2,
                street = $3,
                city = $4,
                state = $5,
                zipcode = $6,
                email = $7,
                phone = $8
                WHERE username = $9`,
                [req.body.name_first,
                  req.body.name_last,
                  req.body.street,
                  req.body.city,
                  req.body.state,
                  req.body.zipcode,
                  req.body.email,
                  req.body.phone,
                  req.user.username
                ])
                .then(() => {
                  res.redirect('/profile');
                })
                .catch((error) => {
                  console.log(error);
                  var newErr1 = new Error('Wrong password');
                  newErr1.status = 403;
                  next(newErr1);
                });
              } else {
                var newErr2 = new Error('Wrong password');
                newErr2.status = 404;
                next(newErr2);
              }
            });
          });

          return router;
        };

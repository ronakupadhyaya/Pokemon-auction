var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  router.use( function(req, res, next) {
    if (! req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  router.get('/dashboard', (req, res) => {
    db.query(`SELECT auction.id AS "a_id", * FROM auction JOIN pokemon ON auction.fk_pokemon = pokemon.id;`)
      .then(results => {
        const aucs = results.rows.map(auction => {
          const dt = new Date(auction.datetime_end);
          const d1 = dt.getFullYear();
          const d2 = dt.getMonth() > 9 ? dt.getMonth() : '0' + dt.getMonth();
          const d3 = dt.getDate() > 9 ? dt.getDate() : '0' + dt.getDate();
          auction["end_date"] = [d1,d2,d3].join('-');
          const t1 = dt.getHours() > 9 ? dt.getHours() : '0' + dt.getHours();
          const t2 = dt.getMinutes() > 9 ? dt.getMinutes() : '0' + dt.getMinutes();
          auction["end_time"] = t1 + ":" + t2;
          return auction;
        });
        res.render('dashboard',{
          auctions: aucs
        });
      });
  });
  router.get('/profile', (req, res) => {
    res.render('profile', {user: req.user});
  });
  router.post('/profile', (req, res, next) => {
    const b = req.body;
    bcrypt.compare(b.password, req.user.password, function(err, result) {
      if (err) {
        var newErr = new Error(err);
        newErr.status = 404;
        next(newErr);
      } else if (result) {
        db.query(`UPDATE users SET street = $1, city = $2, state = $3, zip = $4, email =$5, phone = $6 WHERE id = $7;`, [
          b.street,
          b.city,
          b.state,
          b.zip,
          b.email,
          b.phone,
          req.user.id
        ]).then(result => {
          res.redirect('/profile');
        }).catch(err => {
          console.log("PROFILE POST err", err);
          var newErr = new Error(err);
          newErr.status = 404;
          next(newErr);
        });
      } else {
        var newErr2 = new Error('Wrong password');
        newErr2.status = 404;
        next(newErr2);
      }
    });
  });
  router.get('/auction/new', (req, res, next) => {
    res.render('auction_new');
  });
  router.post('/auction/new', (req, res, next) => {
    const b = req.body;
    db.query(`SELECT id FROM pokemon WHERE name = $1`, [b.name]).then(result => {
      if (result.rows.length === 0) {
        next(new Error('No pokemon found'));
      } else {
        db.query(`INSERT INTO auction VALUES (default,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);`, [
          result.rows[0].id,
          req.user.id,
          b.bid,
          b.reserve,
          new Date(),
          new Date(Date.parse(b.date+' '+b.time)),
          b.street,
          b.city,
          b.state,
          b.zip,
          b.description
        ]).then(result => {
          res.redirect('/dashboard');
        }).catch(err => {
          next(new Error(err));
        });
      }
    });
  });
  router.get('/auction/:id', (req,res, next) => {
    db.query(`SELECT * FROM auction WHERE id = $1`,[req.params.id])
      .then(result => {
        res.render('auction',{
          user:req.user,
          auction:result.rows[0]
        });
      }).catch(err => {
        next(new Error(err));
      });
  });
  router.post('/auction/update/:id', (req,res, next) => {
    db.query(`SELECT id FROM pokemon WHERE name = $1`,[req.body.name])
      .then(pokemon => {
        const id = pokemon.rows[0].id;
        const b = req.body;
        db.query(`UPDATE auction SET
          fk_pokemon = $1, bid = $2, reserve = $3, datetime_end = $4, street =$5, city = $6, state = $7, zip = $8, description = $9 WHERE id = $10;`,
          [id,b.bid,b.reserve,new Date(Date.parse(b.date+' '+b.time)),b.street,b.city,b.state,b.zip,b.description,req.params.id])
          .then(result => {
            res.redirect('/dashboard');
          }).catch(err => {
            next(new Error(err));
          });
      }).catch(err => {
        next(new Error(err));
      });
  });
  router.post('/auction/delete/:id', (req,res, next) => {
    db.query(`DELETE FROM auction WHERE id = $1`,[req.params.id])
      .then(result => {
        res.redirect('/dashboard');
      }).catch(err => {
        next(new Error(err));
      });
  });
  router.post('/auction/bid/:id', (req,res,next) => {
    db.query(`INSERT INTO bid VALUES (default,$1,$2,$3)`,[req.user.id,req.params.id,req.body.amount])
      .then(result => {
        res.redirect('/dashboard');
      }).catch(err => {
        next(new Error(err));
      });
  });
  return router;
};

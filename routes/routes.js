var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  // YOUR CODE HERE

  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.get('/register', (req, res) => {
    res.render('register');
  });

  router.use((req, res, next) => {
    if(!req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  router.get('/dashboard', (req, res) => {
    db.query('SELECT a.id, a.pokemon_id, a.opening_bid, a.reserve_price, a.auction_length, a.start_date, a.created_at, a.shipping_location, a.description, a.status, a.created_user_id, p.name, p.type, p.img_url, a.created_user_id=$1 as isCreatedByUser, (SELECT MAX(amount) from bids where auction_id=a.id) as "max_bid" from auction as a join pokemon as p on p.id=a.pokemon_id', [req.user.id])
      .then(result => {
        console.log("Result rows", result.rows);
        res.render('dashboard', {user: req.user, auctions: result.rows});
      });

  });
  router.get('/dashboard/:status', (req, res) => {
    db.query(`SELECT a.id, a.pokemon_id, a.opening_bid, a.reserve_price, a.auction_length, a.start_date, a.created_at, a.shipping_location, a.description, a.status, a.created_user_id, p.name, p.type, p.img_url, a.created_user_id=$1 as isCreatedByUser, (SELECT MAX(amount) from bids where auction_id=a.id) as "max_bid", (SELECT username from users as u join bids as b on (SELECT MAX(amount) from bids where auction_id=a.id) = b.amount AND u.id=b.user_id ) as max_bid_user from auction as a join pokemon as p on p.id=a.pokemon_id WHERE a.status=$2`, [req.user.id, req.params.status])
      .then(result => {
        console.log("finished rows", result.rows);
        res.render('dashboard', {user: req.user, auctions: result.rows, status: req.params.status==='finished'});
      });
  });
  router.get('/profile', (req, res) => {
    res.render('profile', {user: req.user});
  });
  router.post('/profile/edit', (req, res) => {
    console.log("REQ BODY", req.body, req.user.password);
    bcrypt.compare(req.body.password, req.user.password)
      .then(resp => {
        if(!resp) {
          res.render('profile', {user: req.user, error: 'Did not enter correct password'});
        } else {
          if(req.body.new_password) {
            bcrypt.hash(req.body.new_password, saltRounds)
              .then(hash => {
                return db.query('UPDATE users set username=$1, password=$2, email=$3, street_address=$4, city=$5, zipcode=$6 WHERE username=$7', [req.body.username, hash, req.body.email, req.body.street_address, req.body.city, parseInt(req.body.zipcode), req.body.username]);
              })
              .then(result => {
                console.log("result rows", result.rows);
                res.render('profile', {user: result.rows[0]});
              });
          } else {
            db.query('UPDATE users set username=$1, email=$3, street_address=$4, city=$5, zipcode=$6 WHERE username=$7', [req.body.username, req.body.email, req.body.street_address, req.body.city, parseInt(req.body.zipcode), req.body.username])
              .then(result => {
                res.render('profile', {user: result.rows[0]});
              });
          }

        }
      });

  });

  router.get('/auction/new', (req, res) => {
    db.query('SELECT DISTINCT name from pokemon')
      .then(result => {
        res.render('newAuction', {pokemon: result.rows});
      });

  });

  router.post('/auction/new', (req, res) => {
    console.log("req body", req.body);
    //select pokemon first
    db.query('SELECT id, name from pokemon WHERE name=$1', [req.body.name])
      .then(result => {
        console.log("results", result);
        return db.query('INSERT into auction (pokemon_id, opening_bid, reserve_price, auction_length, start_date, created_at, shipping_location, description, status, created_user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [result.rows[0].id, req.body.opening_bid, req.body.reserve_price, req.body.auction_length, new Date(), new Date(), req.body.shipping_location, req.body.description, "running", req.user.id]);
      })
      .then(resp => {
        console.log("created row", resp);
        res.redirect('/auction/' + resp.rows[0].id);
      })
      .catch(err => {
        console.log("ERR", err);
      });
  });

  router.get('/auction/:id', (req, res) => {
    db.query('SELECT a.id, a.pokemon_id, a.opening_bid, a.reserve_price, a.auction_length, a.start_date, a.created_at, a.shipping_location, a.description, a.status, a.created_user_id, p.name, p.type, p.img_url, (SELECT MAX(amount) from bids where auction_id=a.id) as "max_bid" from auction as a join pokemon as p on p.id=a.pokemon_id left join bids as b on b.auction_id = a.id where a.id=$1', [req.params.id])
      .then(result => {
        const stillRunning = result.rows[0].status === 'running';
        const maxBid = result.rows[0].max_bid;
        console.log("ahh", result.rows[0]);
        res.render('auction', {auction: result.rows[0], stillRunning, maxBid});
      });
  });

  router.post('/auction/edit/:auction_id', (req, res) => {

    db.query('UPDATE auction SET reserve_price=$1, shipping_location=$2, description=$3, auction_length=$4 WHERE id=$5', [req.body.reserve_price, req.body.shipping_location, req.body.description, req.body.auction_length, req.params.auction_id])
      .then(result => {
        res.redirect('/auction/' + req.params.auction_id);
      });
  });

  router.post('/auction/delete/:auction_id', (req, res) => {
    db.query('DELETE from auction WHERE id=$1', [req.params.auction_id])
      .then(() => {
        res.redirect('/dashboard');
      });
  });

  router.post('/auction/bid/:auction_id/:max_bid/:opening_bid', (req, res) =>{
    console.log("HEHEHEHEH", req.body);
    if(parseInt(req.body.amount) > parseInt(req.params.max_bid)+0.5 && parseInt(req.body.amount) > parseInt(req.params.opening_bid)+0.5){
      db.query('INSERT INTO bids (auction_id, user_id, amount, created) VALUES ($1, $2, $3, $4)', [req.params.auction_id, req.user.id, req.body.amount, new Date()])
        .then( () => {
          res.redirect('/dashboard');
        });
    } else {
      //doesn't work
      db.query('SELECT a.id, a.pokemon_id, a.opening_bid, a.reserve_price, a.auction_length, a.start_date, a.created_at, a.shipping_location, a.description, a.status, a.created_user_id, p.name, p.type, p.img_url, a.created_user_id=$1 as isCreatedByUser, (SELECT MAX(amount) from bids where auction_id=a.id) as "max_bid" from auction as a join pokemon as p on p.id=a.pokemon_id', [req.user.id])
        .then(result => {
          console.log("Result rows", result.rows);
          res.render('dashboard', {user: req.user, auctions: result.rows, error: "Your bid is too low"});
        });
    }

  });
  return router;
};

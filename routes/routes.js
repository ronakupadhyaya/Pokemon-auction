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
    res.render('dashboard', {user: req.user});
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
  return router;
};

"use strict";
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var saltRounds = 10;

module.exports = function(passport, db) {
  router.get('/login', (req, res, next) => {
    res.render('login');
  });

  router.get('/register', (req, res, next) => {
    res.render('register');
  });

  router.post('/register', (req, res) => {
    console.log('req.body: ', req.body);
    console.log('user: ' ,req.body.username);
    db.query('SELECT * from users WHERE username=$1', [req.body.username])
      .then(result => {
        console.log('result body >> ', req.body);
        if(result.rows.length !== 0) {
          res.send('Username already taken!');
        } else {
          if(req.body.password !== req.body.password2) {
            res.send("Passwords don't match");
          } else {
            bcrypt.hash(req.body.password, saltRounds)
              .then(hash => {
                console.log('password: ', req.body.password, 'hash: ', hash);
                return db.query('INSERT into users (username, firstname, lastname, password, email, phone, address, city, state, country, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [req.body.username, req.body.firstname, req.body.lastname, hash, req.body.email, req.body.phone, req.body.street, req.body.city, req.body.state, req.body.country, req.body.postal]);
              })
              .then(() => {
                res.redirect('/login');
              });
          }
        }
      });
  });

  router.post('/login', passport.authenticate('local', {successRedirect: '/dashboard', failureRedirect: '/login'}));

  router.post('/update', (req, res) => {
    
  });

  return router;
}

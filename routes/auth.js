"use strict";
var express = require('express');
var router = express.Router();

module.exports = function(passport, db) {
  // YOUR CODE HERE
  router.get('/login', (req, res, next) => {
    res.render('login');
  });

  router.get('/register', (req, res, next) => {
    res.render('register');
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));

  router.post('/register', (req, res, next) => {
    db.query("SELECT * FROM users WHERE username = $1", [req.body.username])
      .then((user) => {
        console.log('user is: ', user);
        if(user.rows.length > 0) {
          res.send('username already exists');
        } else {
          if (req.body.password === req.body.password2){
            console.log('reqbody', req.body);
            db.query("INSERT INTO users (username, password, email, phone, street_address, city, state, country, postal_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [req.body.username, req.body.password, req.body.email, req.body.phone, req.body.street, req.body.city, req.body.state, req.body.country, req.body.postal])
              .then((user) => {
                res.redirect('/login');
              })
              .catch((err) => {
                console.log('error creating new user', err);
              });
          } else {
            res.send('passwords dont match');
          }
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  });

  return router;
};

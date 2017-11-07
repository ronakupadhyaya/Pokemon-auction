"use strict";
var express = require('express');
var router = express.Router();

module.exports = function(passport, db) {
  // YOUR CODE HERE

  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.get('/register', (req, res) => {
    res.render('register');
  });

  router.post('/register', (req, res) => {
    if (req.body.password === req.body.password2 ){
      console.log('passwords match');
      db.query('select * from users where username = $1', [req.body.username])
      .then(function(result){
        console.log('username uniqueness check');
        if (!result.rowCount){
          console.log('username is unique');
          console.log(req.body);
          return db.query('insert into users (street_address, city, state, zipcode, username, password, email, phone) values ($1, $2, $3, $4, $5, $6, $7, $8)',
          [req.body.street, req.body.city, req.body.state, req.body.postal, req.body.username, req.body.password, req.body.email, req.body.phone]);
        }
      })
      .then(result => {
        console.log('success, redirecting to login');
        res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
      });
    }
  });

  router.post('/login', passport.authenticate ('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));

  return router;
};

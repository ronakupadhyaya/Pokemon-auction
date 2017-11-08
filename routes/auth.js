"use strict";
var express = require('express');
var router = express.Router();

module.exports = function(passport, db) {
  // YOUR CODE HERE
  router.get('/register', function(req, res) {
    res.render('register');
  });

  var validateReq = function(password, passwordRepeat) {
    return (password === passwordRepeat);
  };

  router.post('/register', function(req, res) {
    console.log('ROUTER REGISTER');
    if (!validateReq(req.body.password, req.body.password2)) {
      console.log('hello');
      res.render('register', {
        error: "Passwords don't match."
      });
    } else {
      db.query(`SELECT username FROM users WHERE username = $1`, [req.body.username])
        .then((result) => {
          console.log(result);
          if (result.rows.length > 0) {
            console.log('USER ALREADY EXISTS');
            res.render('register', {
              error: "User already exists"
            });
          } else {
            db.query(`INSERT INTO users (street_address, city, state, zipcode, username, password, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`, [req.body.street, req.body.city, req.body.state, req.body.postal, req.body.username, req.body.password, req.body.email, req.body.phone])
              .then((user) => {
                console.log(user);
                if (user) {
                  res.redirect('/login');
                }
              });
          }
        })
        .catch((err) => {
          console.log('ERROR', err);
          res.status(500).redirect('/register');
        });
    }
  });

  router.get('/login', function(req, res) {
    res.render('login');
  });

  router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/dashboard');
    });
  return router;
};

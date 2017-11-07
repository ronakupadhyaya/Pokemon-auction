"use strict";
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = function(passport, db) {
  router.post('/register', (req, res) => {
    console.log(req.body.username);
    db.query('SELECT * from users WHERE username=$1', [req.body.username])
      .then(result => {
        if(result.rows.length !== 0) {
          res.send('Username already taken!');
        } else {
          if(req.body.password !== req.body.password2) {
            res.send("Passwords don't match");
          } else {
            bcrypt.hash(req.body.password, saltRounds)
              .then(hash => {
                return db.query('INSERT into users (username, password, email, phone_number, street_address, city, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7)', [req.body.username, hash, req.body.email, req.body.phone, req.body.street, req.body.city, req.body.postal]);
              })
              .then(() => {
                res.redirect('/login');
              });
          }
        }

      });
  });
  router.post('/login', passport.authenticate('local', {successRedirect: '/dashboard', failureRedirect: '/login'}));
  return router;
};

"use strict";
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var hashedPassword;

module.exports = function(passport, db) {

  router.get('/login', (req, res) => {
    res.render('login');
  });
  router.get('/register', (req, res) => {
    res.render('register');
  });
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));
  router.post('/register', (req, res) => {
    db.query(`SELECT username FROM users WHERE username = $1`, [req.body.username])
    .then(user => {
      if(user.rows.length !== 0){
        res.status(400).json({success: false, msg: 'Username already exists.'});
      } else if(req.body.password === req.body.password2){
          bcrypt.hash(req.body.password, 10, function(err, hash) {
            hashedPassword = hash;
            db.query(`INSERT INTO users VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [req.body.name_first, req.body.name_last, req.body.street,
              req.body.city, req.body.state, req.body.postal,
              req.body.email, req.body.phone, req.body.username, hashedPassword])
              .then(() => {
                res.redirect('/login');
              })
              .catch(err => {
                throw new Error(err);
              });
          });
        }
      })
      .catch(err => {
        throw new Error(err);
      });
    });

  return router;
};

// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//   // Store hash in your password DB.
// });

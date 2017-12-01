"use strict";
var express = require('express');
var router = express.Router();

module.exports = function(passport, db) {
  // YOUR CODE HERE
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));

  router.post('/register', (req, res)=>{
    console.log('in register');
    db.query(
      `SELECT * FROM users
      WHERE username = $1`,
      [req.body.username]
    )
      .then((response)=>{
        if(response.rows[0]){
          console.log('this user already exists');
          res.redirect('/register');
        } else {
          if(req.body.password !== req.body.password2) {
            console.log('passwords do not match');
            res.redirect('/register');
          }
          else {
            console.log('saving user...');
            db.query(
              `INSERT INTO users (username, password, phone_number, email, street_address, city, state, zipcode)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8);`
              , [req.body.username, req.body.password, parseInt(req.body.phone), req.body.email, req.body.street, req.body.city, req.body.state, req.body.postal])
              .then(()=>res.redirect('./login'));
          }
        }
      });
  });

  return router;
};

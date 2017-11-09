"use strict";
var express = require('express');
var router = express.Router();
var crypt = require('bcrypt')

module.exports = function(passport, db) {
  // YOUR CODE HERE

  router.get('/login', (req, res)=>{
    res.render('login', {})
  })
  
  router.post('/login', passport.authenticate('local', 
    {successRedirect: '/dashboard', failureRedirect: '/login'}
  )
  )
  
  router.get('/register', (req, res)=>{
    res.render('register', {})
  })
  
  var validateReq = function(userData) {
    db.query(`SELECT * FROM users WHERE username = $1;`, [userData.username])
    .then(function(result){
      if (result.rows.length > 0){
        return `${userData.username} is already taken.`
      }
    })
  
    if (userData.password !== userData.password2) {
      return "Passwords don't match.";
    }
  
    if (!userData.username) {
      return "Please enter a username.";
    }
  
    if (!userData.password) {
      return "Please enter a password.";
    }
  };
  
  router.post('/register', (req, res)=>{
    var registerError = validateReq(req.body)
    if (registerError){
      throw registerError;
    }
  
    db.query(`insert into users
    (id, username, pword, email, phone, street, city, state, country, zipcode)
      values
      (default, $1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      [req.body.username, req.body.password, req.body.email, req.body.phone, req.body.street, req.body.city, req.body.state, req.body.country, req.body.postal]
    )
    .then(function(result){
      console.log('user created successfully')
      res.redirect('/login')
    })
    .catch(function(error){
      console.log(`there was an error creating user: ${req.body.username}\n`, error);
    })
  })

  return router;
}

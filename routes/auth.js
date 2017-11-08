"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

module.exports = function(passport, db) {

  router.get('/login', (req, res, next) => {
    res.render('login', {title: 'Login'})
  });

  router.get('/register', (req, res, next) => {
    res.render('register', {title: 'Register'})
  });

  router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/dashboard')
  })

  router.post('/register', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const email = req.body.email;
    const address = req.body.street + ', ' + req.body.city + ', ' + req.body.state + ', ' + req.body.country + ' ' + req.body.postal

    if(username.length < 1 || password.length < 1 || password ==! password2 || email.length < 1 || address.length < 1) {
      res.render('/register', {title: 'Error: Please input all fields correctly'})
    }
    
    db.query('SELECT username FROM users WHERE username = $1', [req.body.username])
      .then((res) => {
        if(res.rows.length === 0) {

        }
      })
    // if(req.body.password !== req.body.password2) {
    //   res.redirect('/register')
  });

  return router;
}

  "use strict";
  var express = require('express');
  var router = express.Router();

  module.exports = function(passport, db) {
    // YOUR CODE HERE


      router.get('/login', (req, res, next) => {
        console.log('get login.');
        res.render('login');
      })

      router.get('/register', (req, res, next) => {
        console.log('get register.');
        res.render('register');
      })



    router.post('/login', passport.authenticate('local', { successRedirect: '/dashboard',
                                                      failureRedirect: '/login' }));


    router.post('/register', (req, res) => {
      console.log('in register.');
      if(req.body.password === req.body.password2){
        db.query(`select * from users where username = $1`, [req.body.username])
        .then((result) => {
          console.log('result: ', result.rows);
          if(result.rows.length === 0){
            db.query(`insert into users (username, password, email, phone, street, city, state, country, postal)
                      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [req.body.username, req.body.password, req.body.email, req.body.phone, req.body.street, req.body.city, req.body.state, req.body.country, req.body.postal])
                      .then(() => {
                        console.log('redirecting to login after making user.');
                        res.redirect('/login')
                      })
                      .catch(err => {
                        console.log('error creating new user', err)
                        res.redirect('/register', {
                          error: 'Could not create user'
                        })
                      })
          }  else {
            console.log('redirecting to register after post register.');
            res.redirect('/register')
          }
        })
        .catch(err => {
          console.log(err);
          res.redirect('/register', {
            error: 'Username is taken'
          })
        })
      }  else {
        console.log('passwords have to match.');
        res.redirect('/register', {
          error: 'Passwords do not match.'
        })
      }
    })
    return router;
  }

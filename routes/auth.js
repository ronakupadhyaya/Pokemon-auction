"use strict";
var express = require('express');
var router = express.Router();

module.exports = function(passport, db) {
  // YOUR CODE HERE



  router.get('/login', (req, res, next) => {
    res.render('login')
  });

  router.get('/register', (req, res, next) => {
    res.render('register')
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  })
);

  router.get('/dashboard', (req, res, next) => {
    console.log('THIS IS REQ LOOK FOR USER!!!', req.user);
    res.render('dashboard', {name: req.user})
  })

  router.post('/register', (req, res, next) => {
    db.query(`SELECT * FROM user_db WHERE username = $1`, [req.body.username])
    .then((user) => {
      console.log('user is in DB as: ', user);
      if(user.rows[0] !== req.body.username && req.body.password === req.body.password2){
        db.query(`INSERT INTO user_db VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9)`, [req.body.username, req.body.password, req.body.email, req.body.phone, req.body.street, req.body.city, req.body.state, req.body.country, req.body.postal])
        .then(user => res.redirect('/login')).catch((err) => {console.log('blah', err);
      })
      // console.log('username is already taken');
      // res.send('username is already taken');
    } else if (req.body.password === req.body.password2) {
      db.query(`INSERT INTO user_db VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9)`, [req.body.username, req.body.password, req.body.email, req.body.phone, req.body.street, req.body.city, req.body.state, req.body.country, req.body.postal])
      .then(user => res.redirect('/login')).catch((err) => {console.log('blah', err);
    })
    }
    })
    .catch((err) => {
      console.log('you had an err reigstering', err);
    })
  })


  return router;
}

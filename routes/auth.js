"use strict";
var express = require('express');
var router = express.Router();

module.exports = function(passport, db) {
  router.get('/login', (req, res) => {
    res.render('login')
  })

  router.get('/register', (req, res) => {
    res.render('register')
  })

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }))

  router.post('/register', (req, res) => {
    let body = req.body;
    if (body.password !== body.password2) {
      res.send('passwords dont match ya dumb')
    }
    else {
      db.query(`
        SELECT username
        FROM users
        WHERE username = $1`,
      [body.username]
      )
      .then((result) => {
        if (result.rows.length) {
          res.send('uname taken')
        }
        else {
          db.query(`
            INSERT INTO
              users (username, password, email, phone, street, city, state, country, postal)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [body.username, body.password, body.email,
              body.phone, body.street, body.city,
              body.state, body.country, body.postal]
          ).then((result) => {
            res.render('login')
          })
        }
      })
      .catch((err) => {
        res.send('db error sorry yo', err)
        console.log(err);
      })
    }
  })

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  })

  return router;
}

"use strict";
const express = require('express');
const router = express.Router();
const _ = require('underscore');

module.exports = function(passport, db) {

  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.get('/register', (req, res) => {
    res.render('register');
  });

  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/dashboard'
  }));

  router.post('/register', async (req, res) => {
    try {
      //Acquire Data
      const data = _.mapObject(req.body, val => val || null);
      const check = await db.query(`
        SELECT *
        FROM users
        WHERE username = $1;
        `, [data.username]);

      //Error Checking
      if (!data.username) data.error = 'Username is required!';
      if (!data.password) data.error = 'Password is required!';
      if (data.password !== data.password2) data.error = 'Passwords do not match!';
      if (check.rows.length > 0) data.error = 'Username already taken.';
      if (data.error) {
        res.render('register', data);
        return;
      }

      //Update Database
      await db.query(`
        INSERT INTO users (username, password, name_first, name_last, street_address, city, state, country, zipcode, email, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
      `, [data.username, data.password, data.name_first, data.name_last, data.street_address, data.city, data.state, data.country, data.postal, data.email, data.phone]);
      res.redirect('/login');

    } catch (e) {
      res.json({ success: false, error: e });
    }
  });

  return router;
};

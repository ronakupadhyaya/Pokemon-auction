"use strict";
var express = require('express');
var router = express.Router();

module.exports = function(passport, db) {
  router.get('/login', (req, res, next) => {
    res.render('login');
  });

  router.get('/register', (req, res, next) => {
    res.render('register');
  });

  return router;
}

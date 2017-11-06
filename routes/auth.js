"use strict";
var express = require('express');
var router = express.Router();

module.exports = function(passport, db) {
  // YOUR CODE HERE
  router.get('/register', (req,res) => {
    res.render('register');
  });
  return router;
}

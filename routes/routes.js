var express = require('express');
var router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  // YOUR CODE HERE

  router.get('/login', (req, res, next) => {
    res.render('login.hbs');
  });

  router.get('/register', (req, res, next) => {
    res.render('register.hbs');
  });

  router.get('/test', (req, res, next) => {
    res.render('header.hbs');
  });

  return router;
};

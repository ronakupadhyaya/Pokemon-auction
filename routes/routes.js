var express = require('express');
var router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  router.use((req, res, next) => {
    if (! req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  router.get('/dashboard', (req, res, next) => {
    res.render('dashboard');
  });

  router.get('/auction/new', (req, res, next) => {
    res.render('newAuction');
  });

  router.post('/auction/new', (req, res, next) => {
    res.redirect('/dashboard');
  });

  return router;
};

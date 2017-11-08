const express = require('express');
const router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  router.use(function(req, res, next) {
    if (! req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  router.get('/dashboard', (req, res) => {
    res.render('dashboard', req.user.username);
  });

  router.get('/profile', (req, res) => {
    const user = Object.assign({}, req.user);
    delete user.password;
    res.render('profile', user);
  });

  return router;
};

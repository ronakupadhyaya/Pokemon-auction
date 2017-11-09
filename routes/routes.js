var express = require('express');
var router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  // YOUR CODE HERE

  router.use(function(req, res, next) {
    if (! req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  router.get('/dashboard', (req, res)=>{
    res.render('dashboard', {})
  })

  return router;
}

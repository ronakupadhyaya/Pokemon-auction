var express = require('express');
var router = express.Router();
var pool = require('../pool');
var _ = require('underscore');

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

  router.get('/profile', (req, res) => {
    const requser = {first_name: 'jeff', last_name: 'tang', street_adress: '450 9th St.', city: 'San Francisco', state: 'CA', zipcode: 94109, username: 'tangsauce', password: 'baseball', email: 'jeff@gmail.com', phone: 5134263380};
    // const user = _.filter(requser, (val, key) => (key !== 'password'));
    res.render('profile', {title: 'Profile', user: requser});
  });

  router.post('/profile', (req, res) => {
    // may pass in req.body.first_name
    const query = {
      text: 'SELECT * FROM users WHERE user=$1 SET',
      values: [req.user.username, req.body.first_name, req.body.last_name, req.body.street_address, req.body.city, req.body.state, req.body.zipcode, req.body.username, req.body.password, req.body.email, req.body.phone] // what happens to req.user when db username is changed? do we have to login into MongoStore again / reserialize?
    };
    pool.query(query)
    .then(resp => res.json({resp}))
    .catch(err => res.json({err}));
  });

  return router;
};

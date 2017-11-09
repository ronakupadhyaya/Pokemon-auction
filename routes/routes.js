var express = require('express');
var router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  router.get('/dashboard', (req, res, next) => {
    res.render('dashboard', {title: 'PokeBay'});
  });

  router.get('/profile', (req, res, next) => {
    if (req.user === undefined) {
      console.log('req.user is undefined');
      //user not logged in
      res.json({});
    } else {
      console.log('req.user HERE: ', req.user);
      res.render('profile', {
        title: 'PokeBay',
        firstName: req.user.firstname,
        lastName: req.user.lastName,
        email: req.user.email,
        street: req.user.address,
        city: req.user.city,
        state: req.user.state,
        postal: req.user.zipcode,
        username: req.user.username,
        phone: req.user.phone,
        country: req.user.country
      });
        // res.json({
        //   username: req.username,
        //   id: req.id,
        //   firstName: req.firstName,
        //   lastName: req.lastName,
        //   email: req.email,
        //   street: req.address,
        //   city: req.city,
        //   state: req.state,
        //   postal: req.zipcode,
        //   country: req.country,
        //   phone: req.phone
        // });
    }
  });
  router.get('/update', (req, res, next) => {
    console.log('req.user: ', req.user);
    console.log('req.body: ', req.body);
    res.render('update', {
      firstName: req.user.firstname,
      lastName: req.user.lastname,
      email: req.user.email,
      street: req.user.address,
      city: req.user.city,
      state: req.user.state,
      postal: req.user.zipcode,
      username: req.user.username,
      phone: req.user.phone,
      country: req.user.country
    });
  });
  return router;
}

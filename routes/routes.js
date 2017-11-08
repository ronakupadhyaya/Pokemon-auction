var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

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

  router.get('/dashboard', (req, res, next) => {
    console.log('get dashboard.');
    res.render('dashboard');
  })

  router.get('/profile', (req, res, next) => {
    console.log('get profile.');
    res.render('profile', {user: req.user});
  })

  router.get('/editprofile', (req, res, next) => {
    console.log('user: ', req.user);
    res.render('editprofile', {user: req.user});
  })

  router.get('/enterpassword', (req, res, next) => {
    console.log('entering the password.');
    res.render('enterpassword', {password: req.user.password});
  })

  router.post('/samepassword', (req, res, next) => {
    console.log('testing if passwords are the same.');
    if(req.user.password === req.body.password){
      console.log('passwords match, redirecting.');
      res.redirect('/editprofile');
    }  else {
      console.log('passwords do not match.');
      res.redirect('/profile');
    }
  })

  router.post('/update', (req, res, next) => {
    console.log('req.body: ', req.body);
    console.log('req.user: ', req.user);
    db.query(`UPDATE users set username = $1, password = $2, email = $3, phone = $4, street = $5, city = $6, state = $7, country = $8, postal = $9 where username = $10`,
       [req.body.username, req.body.password, req.body.email, req.body.phone, req.body.street, req.body.city, req.body.state, req.body.country, req.body.zipcode, req.user.username])
       .then(() => res.redirect('/profile'))
       .catch(err => console.log('error updating', err))
    // need to update sql and then
    // redirect to profile
  })



  return router;
}

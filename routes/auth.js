"use strict";
var express = require('express');
var router = express.Router();


module.exports = function(passport, db) {
  // YOUR CODE HERE

  router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

  function checkPassword(password, confirm){
    return password === confirm;
  }

  // router.post('/register',
  //   function(req, res){
  //     if(!checkPassword(req.body.password, req.body.password2)){
  //       res.render('/register', {
  //         "Error: Passwords do not match!"
  //       });
  //       console.log('Registered user does not match password');
  //       return;
  //     }
  //   })
  // );

  return router;
};

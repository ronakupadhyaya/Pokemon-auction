"use strict";
var express = require('express');
var router = express.Router();

module.exports = function(passport, db) {

  router.get('/login',function(req,res){
    res.render('login');
  });

  router.get('/register',function(req,res){
    res.render('register');
  });

  router.post('/login', passport.authenticate('local',{
    failureRedirect: '/login',
    successRedirect: '/dashboard'
  }));

  router.post('/register',function(req,res){
    const data = Object.assign({},req.body);
    if(!data.username){
      res.render('register', Object.assign({}, data, {error: 'Username is required'}));
      return;
    }
    if(!data.password){
      res.render('register', Object.assign({}, data, {error: 'Password is required'}));
      return;
    }
    if(data.password !== data.password2){
      res.render('register', Object.assign({}, data, {error: 'Passwords do not match'}));
      return;
    }
    db.query(`
      SELECT
        username
      FROM
        users
      WHERE
        username = $1
    ;`,[data.username])
      .then((result)=>{
        if(result.rows.length!==0){
          return false;
        }
        else {
          return db.query(`
            INSERT INTO
              users   ( username,       password,       name_first,               name_last,              street,                 city,               state,              country,              zipcode,              email,              phone )
              VALUES  ( $1,             $2,             $3,                       $4,                     $5,                     $6,                 $7,                 $8,                   $9,                   $10,                $11  )
          ;`,         [ data.username,  data.password,  data.name_first || null,  data.name_last || null, data.street || null,    data.city || null,  data.state || null, data.country || null, data.zipcode || null, data.email || null, data.phone || null]);
        }
      })
      .then((result)=>{
        if(!result){
          res.render('register', Object.assign({}, data, {error: 'Username is taken'}));
          return;
        }
        res.redirect('/login');
      })
      .catch((err)=>{
        console.log(err);
        res.render('register', Object.assign({}, data, {error: err.error}));
      });
  });

  return router;
};

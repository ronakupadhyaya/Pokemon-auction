"use strict";
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

module.exports = function(passport, db) {
  router.get('/login', (req, res) => {
    res.render('login');
  });
  router.get('/register', (req, res) => {
    res.render('register');
  });
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));
  router.post('/register', (req,res,next) => {
    db.query(`SELECT username FROM users WHERE username = $1`,[req.body.username])
      .then(userList => {
        if (userList.rows.length !== 0) {
          res.status(400).json({success:false,msg:"user already exists.😰"});
        } else if (req.body.password === req.body.password2) {
          bcrypt.hash(req.body.password, 10, function(err3, hash) {
            if (err3) {
              next(new Error(err3));
              // res.status(400).json({success:false,msg:err3,errno:3});
            } else {
              const b = req.body;
              db.query(`
                INSERT INTO users
                VALUES
                (default, $1,$2,$3,$4,$5,$6,$7,$8);`,
                [b.username,hash,b.street,b.city,b.state,b.postal,b.email,b.phone])
                .then(result => {
                  res.status(200).redirect('/login');
                })
                .catch(err=>{
                  next(new Error(err));
                  // res.status(400).json({success:false,msg:err,errno:1});
                });
            }
          });
        } else {
          res.status(400).json({success:false,msg:'Something went wrong.'});
        }
      })
      .catch(err2 => {
        next(new Error(err2));
        // res.status(400).json({success:false,msg:err2,errno:2});
      });
  });
  router.get('/logout', function(req,res) {
    req.logout();
    res.redirect('/login');
  });
  return router;
};

const express = require('express');
const router = express.Router();
const _ = require('underscore');

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

  router.get('/dashboard', async (req, res) => {
    const result = await db.query(`
      SELECT * FROM auctions;
    `);
    res.render('dashboard', { username: req.user.username, auctions: result.rows });
  });

  router.get('/profile', (req, res) => {
    const user = Object.assign({}, req.user);
    delete user.password;
    res.render('profile', user);
  });

  router.post('/profile', async (req, res) => {
    try {
      const data = _.mapObject(req.body, val => val || null);
      if (data.currPassword !== req.user.password) data.error = 'You must enter your password, silly!';
      if (!data.username) data.error = 'username is required, silly!';
      if (data.password) {
        if (data.password !== data.password2) data.error = 'New passwords must match, silly!';
      } else data.password = req.user.password;
      if (data.username !== req.body.username) {
        const check = await db.query(`
          SELECT *
          FROM users
          WHERE username = $1;
        `, [data.username]);
        if (check.rows.length > 0) data.error = 'Username already taken.';
      }
      if (data.error) {
        res.render('profile', data);
        return;
      }

      db.query(`
        UPDATE users
        SET username = $1,
        password = $2,
        name_first = $3,
        name_last = $4,
        street_address = $5,
        city = $6,
        state = $7,
        country = $8,
        zipcode = $9,
        email = $10,
        phone = $11
        WHERE id = $12;
      `, [
          data.username,
          data.password,
          data.name_first,
          data.name_last,
          data.street_address,
          data.city,
          data.state,
          data.country,
          data.zipcode,
          data.email,
          data.phone,
          req.user.id
        ]);
      res.redirect('/profile');
    } catch (e) {
      res.json({success: false, error: e});
    }
  });

  router.get('/auction/new', async (req, res) => {
    const pokemon = await db.query(`
      SELECT *
      FROM pokemon;
    `);
    res.render('newAuction', {pokemon: pokemon.rows});
  });

  router.post('/auction/new', async (req, res) => {
    try {
      const data = _.mapObject(req.body, val => val || null);
      if (!data.pokemon) {
        const pokemon = await db.query(`
          SELECT *
          FROM pokemon;
        `);
        data.error = 'You must select a pokemon!';
        res.render('newAuction', Object.assign(data, {pokemon: pokemon.rows}));
        return;
      }
      const result = await db.query(`
        INSERT INTO auctions (id, pokemon_id, seller_id, start, auction_length, shipping, opening_bid, reserve_price, description)
        VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id AS id;
      `, [
          data.pokemon,
          req.user.id,
          new Date(),
          data.length,
          data.shipping,
          data.opening_bid,
          data.reserve_price,
          data.description
        ]);
      res.redirect('/auction/' + result.rows[0].id);
    } catch (e) {
      res.json({success: false, error: e});
    }
  });

  router.get('/auction/:id', async (req, res) => {
    try {
      const result = await db.query(`
        SELECT *
        FROM auctions a JOIN pokemon p ON a.pokemon_id = p.id
        WHERE a.id = $1;
        `, [ req.params.id ]);
      const data = result.rows[0];
      const end = new Date(data.start);
      end.setDate(end.getDate() + data.auction_length);
      data.end = end.toDateString() + ' ' + end.toTimeString();
      data.start = data.start.toDateString() + ' ' + data.start.toTimeString();
      data.edit = req.user.id === data.seller_id;
      console.log(data);
      res.render('auction', data);
    } catch (e) {
      res.json({success: false, error: e});
    }
  });

  return router;
};

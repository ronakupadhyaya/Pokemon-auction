var express = require('express');
var router = express.Router();

module.exports = function(db) {
  // router.get('/', (req, res, next) => {
  //   res.render('index', {title: 'PokeBay'});
  // });

  router.use(function(req, res, next) {
    if (! req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  router.get('/', (req, res, next) => {
    res.render('dashboard');
  });

  router.get('/dashboard', (req, res) => {
    db.query(`
      SELECT auctions.id, pokemon.name
      FROM auctions
      JOIN pokemon
      ON auctions.fk_pokemon_id = pokemon.id
    `)
    .then(result => {
      res.render('dashboard', {
        auctions: result.rows
      })
    })
    .catch (err => {
      console.log('shit broke', err)
    })
  })

  router.get('/profile', (req, res) => {
    let userInfo = Object.assign({}, req.user);
    delete userInfo.password
    res.render('profile', {userInfo})
  })

  router.post('/profile', (req, res) => {
    let body = req.body;
    db.query(`
        UPDATE users
        SET email = $1, phone = $2, street = $3, city = $4, state = $5, country = $6, postal = $7
        WHERE id = $8`,
      [body.email, body.phone, body.street, body.city,
        body.state, body.country, body.postal, req.user.id]
    )
    .then((result) => {
      res.redirect('/profile')
    })
    .catch((err) => {
      res.send('db error sorry yo', err)
      console.log(err);
    })
  })

  router.get('/auction/new', (req, res) => {
    db.query(`
      SELECT *
      FROM pokemon
    `)
    .then((result) => {
      res.render('newAuction', {
        pokemons: result.rows
      })
    })
    .catch((err) => {
      res.send('db error sorry yo', err)
      console.log(err);
    })
  })

  router.post('/auction/new', (req, res) => {
    let body = req.body;
    db.query(`
      INSERT INTO
        auctions
      VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [req.user.id, body.pokemon_id, body.opening_bid, body.reserve_price, body.length, body.shipping_location, body.description])
    .then((result) => {
      res.redirect('/auction/' + result.rows[0].id)
    })
    .catch((err) => {
      res.send('db error sorry yo' + err)
      console.log(err);
    })
  })

  router.get('/auction/:id', (req, res) => {
    db.query(`
      SELECT
        *
      FROM
        auctions a
        JOIN users u ON a.fk_user_id = u.id
        JOIN pokemon p ON a.fk_pokemon_id = p.id
      WHERE
        a.id = $1`,
      [req.params.id]
    )
    .then((result) => {
      var endDate = new Date(result.rows[0].created_at)
      endDate.setDate(endDate.getDate() + result.rows[0].length);
      let expired = endDate < new Date();
      res.render((result.rows[0].fk_user_id === req.user.id && !expired) ? 'editableAuction' : 'auction', {
        auction: Object.assign(result.rows[0], {
          length: new Date(endDate - new Date()).getUTCDate(),
        }),
        id: req.params.id
      })
    })
    .catch((err) => {
      console.log(err);
    })
  })

  router.post('/auction/:id', (req, res) => {
    db.query(`
      UPDATE
        auctions
      SET shipping_location = $1, description = $2, length = $3
      WHERE id = $4
      AND fk_user_id = $5
    `, [req.body.shipping_location, req.body.description, req.body.length, req.params.id, req.user.id])
    .then((result) => {
      res.redirect('/auction/' + req.params.id)
    })
    .catch((err) => {
      res.send('db error sorry yo' + err)
      console.log(err);
    })
  });

  router.get('/auctions/:id/delete', (req, res) => {
    db.query(`
      DELETE
      FROM auctions
      WHERE id = $1
      AND fk_user_id = $2
    `, [req.params.id, req.user.id]
    )
    .then(result => {
      res.redirect('/dashboard')
      })
    .catch((err) => {
      console.log(err);
    })
  })

  return router;
}

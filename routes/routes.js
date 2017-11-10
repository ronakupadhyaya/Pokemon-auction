var express = require('express');
var router = express.Router();
var moment = require('moment')

function getDaysRemaining(startDate, length) {
  var endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + length);
  let days = new Date(endDate.getTime() - new Date().getTime());
  days = Math.ceil(days/(1000*3600*24))
  return days > 0 ? days : 10000
}

function getRelativeTime(startDate, length) {
  var endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + length);
  return endDate > startDate ? moment(endDate).fromNow() : 0;
}

module.exports = function(db) {
  router.use(function(req, res, next) {
    if (! req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  router.get('/', (req, res, next) => {
    res.redirect('dashboard');
  });

  router.get('/dashboard', (req, res) => {
    db.query(`
      SELECT
        a.fk_user_id as "auction_owner_id",
        u.username as "auction_owner_username",
        a.id as "auction_id",
        a.created_at as "auction_start",
        a.length as "length",
        p.name as "pokemon_name",
        a.reserve_price,
        a.opening_bid,
        u.city,
        p.image_url,
        MAX(b.amount) as "current_bid",
        COUNT(b.amount) as "number_bids"
      FROM
        auctions a
        JOIN users u ON a.fk_user_id = u.id
        JOIN pokemon p ON a.fk_pokemon_id = p.id
        LEFT OUTER JOIN bids b ON b.fk_auction_id = a.id
      GROUP BY a.id, u.username, p.name, u.city, p.image_url
      ORDER BY a.id
    `)
    .then(result => {
      result.rows.map(row => {
        Object.assign(row, {
          days_remaining: getDaysRemaining(row.auction_start, row.length),
          relative_time: getRelativeTime(row.auction_start, row.length)
        })
      })
      res.render('dashboard', {
        auctions: result.rows,
        keys: ['', 'Pokemon Name', 'Owner Name', 'City', 'Current Bid', 'Number of Bids', 'Time Remaining'],
        title: "Dashboard",
        helpers: {
          isOdd: function(n) {
            return n % 2 === 0;
          }
        }
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
      ORDER BY name
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
        a.fk_user_id as "auction_owner",
        a.id as "auction_id",
        a.created_at as "auction_start",
        *
      FROM
        auctions a
        JOIN users u ON a.fk_user_id = u.id
        JOIN pokemon p ON a.fk_pokemon_id = p.id
        LEFT OUTER JOIN bids b ON b.fk_auction_id = a.id
      WHERE
        a.id = $1
      ORDER BY amount DESC`,
      [req.params.id]
    )
    .then((result) => {
      var auction = result.rows[0];
      var endDate = new Date(auction.auction_start)
      endDate.setDate(endDate.getDate() + auction.length);
      let expired = endDate < new Date();
      let days = new Date(endDate.getTime() - new Date().getTime());
      days = Math.ceil(days/(1000*3600*24))
      let isOwner = auction.auction_owner === req.user.id;
      db.query(`
        SELECT
          *
        FROM
          bids b
        JOIN
          users u
        ON
          u.id = b.fk_user_id
        WHERE
          fk_auction_id = $1
        ORDER BY amount DESC
      `, [req.params.id])
      .then (bids => {
        res.render((isOwner && !expired) ? 'editableAuction' : 'auction', {
          bids: bids.rows,
          auction,
          timeRemaining: days > 0 ? days : 0,
          canBid: !(expired || isOwner),
          error: req.query.error,
          highestBid: {
            amount: bids.rows.length ? bids.rows[0].amount : 0,
            username: bids.rows.length ? bids.rows[0].username : ''
          },
          auction_start: new Date(auction.auction_start).toUTCString(),
          id: req.params.id
        })
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

  router.post('/auction/:id/bid', (req, res) => {
    db.query(`
      SELECT
        a.id,
        a.fk_user_id as "auction_owner",
        a.opening_bid,
        b.fk_user_id as "bidder",
        b.amount as "bid_amount"
      FROM auctions a
        LEFT OUTER JOIN bids b
          ON b.fk_auction_id = a.id
      WHERE a.id = $1
      ORDER BY b.amount DESC
    `, [req.params.id])
    .then((result) => {
      if (result.rows[0].auction_owner === req.user.id) {
        res.redirect('/auction/' + req.params.id)
      }
      else if (req.body.bid -.5 < result.rows[0].bid_amount) {
        res.redirect('/auction/' + req.params.id + "?error=true")
      }
      else {
        db.query(`
          INSERT INTO
            bids
          VALUES (DEFAULT, $1, $2, $3)
        `, [req.params.id, req.user.id, req.body.bid]
      ).then(result => {
        res.redirect('/auction/' + req.params.id)
      })
      }
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

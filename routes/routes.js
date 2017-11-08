var express = require('express');
var router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

<<<<<<< HEAD
  // YOUR CODE HERE
=======
  router.use((req, res, next) => {
    if (! req.user) {
      res.redirect('/login');
    } else {
      console.log(req.user)
      next();
    }
  });
>>>>>>> bb1f0bb3c21f12ba8c1d87ef54137e2cb0d6b48a

  router.get('/profile', (req, res) => {
    // const requser = {first_name: 'jeff', last_name: 'tang', street_adress: '450 9th St.', city: 'San Francisco', state: 'CA', zipcode: 94109, username: 'tangsauce', password: 'baseball', email: 'jeff@gmail.com', phone: 5134263380};
    // const user = _.filter(requser, (val, key) => (key !== 'password'));
    console.log(req.user.street_address); // only renders '450'
    res.render('profile', {title: 'Profile', user: req.user});
  });

<<<<<<< HEAD
  router.post('/profile', (req, res) => {
    // validate req.user.passwordSubmit before querying changes
    if (req.body.passwordSubmit !== req.user.password) {
      res.send('incorrect password');
    } else {
      const query = {
        text: `UPDATE users
                SET city=$2, SET street_address=$3
                WHERE username=$1
              `,
        values: [req.user.username,
                 req.body.city,
                 req.body.street_address]
                 // req.body.street_address]
                 // req.body.city,
                 // req.body.state,
                 // parseInt(req.body.zipcode),
                 // req.body.email,
                 // parseInt(req.body.phone)]
      };
        // text: 'UPDATE users SET street_address=$4 WHERE username=$1',
      console.log(query.values, req.user);
      db.query(query)
      .then(resp => res.json({resp}))
      .catch(err => res.json({err}));
    }
  });

  // const query = {
  //   text: 'SELECT * FROM users WHERE username=$1',
  //   values: ['jeff']
  // };
  // db.query(query)
  // .then(resp => console.log({resp: resp.rows[0]}))
  // .catch(err => console.log({err}));
  //
  //
=======
  router.get('/auction/new', (req, res, next) => {
    db.query('select * from pokemon')
    .then(result => {
      res.render('newAuction', {pokemon: result.rows});
    })
    .catch(err => {
      console.log(err);
    });
  });

  router.post('/auction/new', (req, res, next) => {
    db.query('insert into auctions (fk_users, fk_pokemon, opening_bid, reserve_price, duration, shipping_location, description, creation) values ($1, $2, $3, $4, $5, $6, $7, 00000)',
    [req.user.id, req.body.pokemon, req.body.opening_bid, req.body.reserve_price, req.body.duration, req.body.shipping_location, req.body.description])
    .then(() => {
      console.log('created auction');
      res.redirect(`/dashboard`);
    })
    .catch(err => {
      console.log(err);
    });
  });

  router.get('/auction/:id', (req, res, next) => {
    db.query('select * from auctions a join pokemon p on a.fk_pokemon = p.id where a.id = $1', [req.params.id])
    .then(result => {
      console.log(result);
      if (req.user.id === result.rows[0].fk_users){
        res.render('auction', { auction: result.rows[0], editable: true});
      } else {
        res.render('auction', { auction: result.rows[0]});
      }
    })
    .catch(err => {
      console.log(err);
    });
  });

  router.get('/delete/:auctionid', (req, res, next) => {
    db.query('delete from auctions where id = $1', [req.params.auctionid])
    .then(() => {
      console.log('deleted');
    })
    .catch(err => {
      console.log('Error: ', err);
    })
  })

>>>>>>> bb1f0bb3c21f12ba8c1d87ef54137e2cb0d6b48a
  return router;
};

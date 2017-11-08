var express = require('express');
var router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  // YOUR CODE HERE
  router.use((req, res, next) => {
    if (! req.user) {
      res.redirect('/login');
    } else {
      console.log(req.user);
      next();
    }
  });

  router.get('/dashboard', (req, res, next) => {
    getAuctions();
    async function getAuctions() {
      try {
        const auctions = (await db.query(`
        select max(bid), b.id, p.name, p.type, p.picture from bids b
					left outer join auctions a on b.fk_auctions=a.id
					left outer join pokemon p on a.fk_pokemon=p.id
					group by b.id, p.name, p.type, p.picture
        `)).rows;
        console.log(auctions);
        res.render('dashboard', {auctions});
      }
      catch (err) {
        console.log(err);
      }
    }
  });

  router.get('/profile', (req, res) => {
    res.render('profile', {title: 'Profile', user: req.user});
  });

  router.post('/profile', (req, res) => {
    if (req.body.passwordSubmit !== req.user.password) {
      res.render('profile', {title: 'Profile', user: req.user, error: 'incorrect password'});
    } else {
      const query = {
        text: `UPDATE users
                SET username=$2, password=$3, street_address=$4, city=$5, state=$6, zipcode=$7, email=$8, phone=$9
                WHERE username=$1
              `,
        values: [req.user.username, // 1
                 req.body.username, // 2
                 req.body.password, // 3
                 req.body.street_address, // 4
                 req.body.city, // 5
                 req.body.state, // 6
                 parseInt(req.body.zipcode), // 7
                 req.body.email, // 8
                 parseInt(req.body.phone)] // 9
      };
      db.query(query)
      .then(resp => res.redirect('profile'))
      .catch(err => res.render('profile', {title: 'Profile', user: req.user, error: 'postgres query was bad'}));
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
    db.query('insert into auctions (fk_users, fk_pokemon, opening_bid, reserve_price, duration, shipping_location, description, creation) values ($1, $2, $3, $4, $5, $6, $7, 00000) returning id',
    [req.user.id, req.body.pokemon, req.body.opening_bid, req.body.reserve_price, req.body.duration, req.body.shipping_location, req.body.description])
    .then(result => {
      res.redirect(`/auction/${result.rows[0].id}`);
    })
    .catch(err => {
      console.log(err);
      res.redirect('/auction/new');
    });
  });

  router.get('/auction/:id', (req, res, next) => {
    async function getAuction(){
      try {
        const auction = await db.query('select * from auctions a \
        left join pokemon p on a.fk_pokemon = p.id \
        left join users u on a.fk_users = u.id \
        where a.id = $1', [req.params.id]);
        const bids = await db.query('select * from auctions a \
        left join bids b on b.fk_auctions = a.id \
        left join users u on b.fk_users = u.id \
        where a.id = $1', [req.params.id]);
        sortedBids = bids.rows.sort((a, b) => a.bid < b.bid);
        if (req.user.id === auction.rows[0].fk_users){
          res.render('auction', { auction: auction.rows[0], bids: sortedBids, highest: sortedBids[0], user: req.user, editable: true, ableToBid: sortedBids[0].fk_users === req.user.id ? false : true });
        } else {
          res.render('auction', { auction: auction.rows[0], bids: sortedBids, highest: sortedBids[0], user: req.user, ableToBid: sortedBids[0].fk_users === req.user.id ? false : true  });
        }
      }
      catch (e) {
        console.log('error getting auction: ', e)
      }
    }
    getAuction();
  });

  router.get('/delete/:auctionid', (req, res, next) => {
    console.log(req.params.auctionid);
    db.query('delete from auctions where id = $1', [req.params.auctionid])
    .then(() => {
      console.log('deleted');
      res.redirect('/profile');
    })
    .catch(err => {
      res.redirect('/dashboard');
      console.log('Error: ', err);
    });
  });

  return router;
};

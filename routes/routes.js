var express = require('express');
var router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  // YOUR CODE HERE
  router.get('/login', (req, res)=>{
    res.render('login');
  });

  router.get('/register', (req, res)=>{
    res.render('register');
  });

  router.use(function(req, res, next) {
    if (! req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  router.get('/dashboard', (req, res)=>{
    console.log(req.query);
    db.query(
      `SELECT MAX(b.amount) as highestbid, p.picture, p.name, p.type, a.id as auction_id, a.start_date, a.description, a.length FROM bids b
        RIGHT OUTER JOIN auctions a
          ON b.fk_auction = a.id
        LEFT OUTER JOIN pokemon p
          ON a.fk_pokemon = p.id
      GROUP BY a.id, p.picture, p.name, p.type, a.start_date, a.description, a.length
      ORDER BY a.start_date`
    )
      .then((response) => {
        console.log(response.rows);
        var filter = parseInt(req.query.filter);
        var printRows = response.rows.filter((row)=>{
          var end = new Date(row.start_date);
          end.setDate(end.getDate() + row.length);
          var now = new Date();
          return end.getTime()*filter >= now.getTime()*filter;
        });
        res.render('dashboard', {
          auctions: printRows
        });
      });
  });

  router.get('/profile', (req, res)=>{
    db.query(
      `SELECT * FROM users
        WHERE username = $1`,
      [req.user.username]
    )
      .then((response) => {
        console.log(response.rows[0]);
        res.render('profile', {
          info: response.rows[0]
        });
      });
  });

  router.post('/profile', (req, res) => {
    if(req.body.newPassword === req.body.repeatPassword && req.body.password === req.user.password){
      var passwordVal = req.body.newPassword ? req.body.newPassword : req.user.password;
      db.query(
        `UPDATE users
          SET
            street_address = $1,
            city = $2,
            state = $3,
            zipcode = $4,
            password = $6,
            email = $7,
            phone_number = $8
          WHERE
            username = $5`,
        [req.body.street_address, req.body.city, req.body.state, req.body.zipcode, req.user.username, passwordVal, req.body.email, req.body.phone_number]
      )
        .then(()=>{
          res.redirect('dashboard');
        });
    } else {
      console.log('Incorrect credentials');
      res.redirect('dashboard');
    }
  });

  router.get('/auction/new', (req, res)=> {
    db.query(
      `SELECT * FROM pokemon
        ORDER BY name`
    )
      .then((response)=> {
        console.log(response.rows);
        res.render('newAuction', {
          pokemon: response.rows
        });
      });
  });

  router.post('/auction/new', (req, res)=>{
    var startDate = new Date(req.body.start_date);
    console.log(req.body.openingBid);
    db.query(`
      SELECT now()
    `)
      .then((response) => {
        return db.query(
          `INSERT INTO auctions (
            fk_host,
            fk_pokemon,
            opening_bid,
            start_date,
            create_date,
            length,
            reserve_price,
            description,
            street_address, city, state, zipcode)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`
          , [req.user.id,
            req.body.pokemon,
            parseFloat(req.body.openingBid),
            startDate,
            response.rows[0].now,
            req.body.length,
            parseFloat(req.body.reservePrice),
            req.body.description,
            req.body.street, req.body.city, req.body.state, parseInt(req.body.zipcode)]);
      })
      .then(()=>res.redirect('/dashboard'));
  });

  router.get('/auction/:id', (req, res)=>{
    db.query(
      `SELECT * FROM auctions a
        LEFT OUTER JOIN pokemon p
          ON a.fk_pokemon = p.id
        WHERE a.id = $1`,
      [req.params.id]
    )
      .then((response)=>{
        db.query(`
          SELECT * FROM bids
            WHERE fk_auction = $1`,
          [req.params.id]
        )
          .then((bids)=>{
            var highestBid = bids.rows[0] ? bids.rows[0].amount : response.rows[0].opening_bid;
            res.render('auction', {
              auction: Object.assign({}, response.rows[0], {
                startDate: response.rows[0].start_date.toDateString(),
                highestBid,
                auctionId: req.params.id
              })
            });
          });
      });
  });

  router.post('/auction/bid/:auctionId', (req, res)=>{
    db.query(
      `SELECT MAX(amount) as highestBid, a.opening_bid FROM bids b
        RIGHT  OUTER JOIN auctions a
          ON a.id = b.fk_auction
        GROUP BY a.id, a.opening_bid
        HAVING a.id = $1`,
      [req.params.auctionId]
    )
      .then(bid => {
        var now = new Date();
        console.log(bid.rows[0]);
        var minBid = bid.rows[0].highestbid ? bid.rows[0] + .5 : bid.rows[0].opening_bid;
        console.log(minBid);
        if(req.body.bid >= minBid && req.user.id !== bid.rows[0].fk_user){
          db.query(
            `INSERT INTO bids (fk_auction, fk_user, amount, time)
              VALUES ($1, $2, $3, $4)`,
            [req.params.auctionId, req.user.id, req.body.bid, now]
          )
            .then((response)=>{
              res.redirect(`/auction/${req.params.auctionId}`);
            });
        } else {
          console.log('This bid is too low or you own the current highest bid!');
          res.redirect(`/auction/${req.params.auctionId}`);
        }
      });
  });

  return router;
};

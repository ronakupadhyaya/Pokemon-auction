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
    db.query(`insert into auctions (fk_users, fk_pokemon, opening_bid, reserve_price,
       end_time, shipping_location, description, start_time, creation_time)
       values ($1, $2, $3, $4, $5, $6, $7, $8, localtimestamp)
       returning id`,
       [req.user.id, req.body.pokemon, req.body.opening_bid, req.body.reserve_price,
         req.body.end_time, req.body.shipping_location, req.body.description, req.body.start_time])
    .then(result => {
      res.redirect(`/auction/${result.rows[0].id}`);
    })
    .catch(err => {
      console.log(err);
      res.redirect('/auction/new');
    });
  });

  router.get('/auction/:id', (req, res, next) => {
    function convertTime(millisec) {
       var seconds = (millisec / 1000).toFixed(0);
       var minutes = (millisec / (1000 * 60)).toFixed(0);
       var hours = (millisec / (1000 * 60 * 60)).toFixed(0);
       var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(0);
       if (seconds <= 0){
         return null;
       } else if (seconds < 60) {
           return seconds + " Sec";
       } else if (minutes < 60) {
           return minutes + " Min";
       } else if (hours < 24) {
           return hours + " Hrs";
       } else {
           return days + " Days"
       }
   }
    async function getAuction(){
      try {
        const auction = await db.query(`select * from auctions a
        left join pokemon p on a.fk_pokemon = p.id
        left join users u on a.fk_users = u.id
        where a.id = $1`, [req.params.id]);
        const bids = await db.query(`select * from auctions a
        left join bids b on b.fk_auctions = a.id
        left join users u on b.fk_users = u.id
        where a.id = $1 order by b.bid desc`, [req.params.id]);
        const now = new Date();
        const timeLeft = convertTime(auction.rows[0].end_time - now);
        const auctionObj = {
          auction: auction.rows[0],
          auctionId: req.params.id,
          timeLeft: timeLeft,
          bids: bids.rows,
          highest: bids.rows[0],
          minBid: bids.rows[0].bid ? parseFloat(bids.rows[0].bid) + .50 : parseFloat(auction.rows[0].opening_bid),
          user: req.user,
          ableToBid: bids.rows[0].fk_users === req.user.id ? false : true
        };
        if (req.user.id === auction.rows[0].fk_users){
           auctionObj['editable'] = true;
        }
        res.render('auction', auctionObj);
      }
      catch (e) {
        console.log('error getting auction: ', e)
      }
    }
    getAuction();
  });

  router.get('/edit/auction/:id', (req, res, next) => {
    function convertDateTime(time){
      const date = time.toISOString().split('T')[0];
      console.log(date);
      const newTime = time.toString().split(' ').slice(4);
      console.log(newTime);
    }
    async function loadEdit(){
      try{
        const editAuction = await db.query(`select a.id, p.name, a.description, timezone('PST', a.start_time) as "start_time",
          timezone('PST', a.end_time) as "end_time", a.shipping_location, a.opening_bid
          from auctions a left join pokemon p on p.id = a.fk_pokemon
          where a.id = $1 and a.fk_users = $2`,
        [req.params.id, req.user.id]);
        var editStart = true;
        if (editAuction.rows[0].start_time - new Date() <= 0){
          editStart = false;
        }
        convertDateTime(editAuction.rows[0].start_time);
        const startTime = editAuction.rows[0].start_time.toISOString().slice(0, 16);
        const endTime = editAuction.rows[0].end_time.toISOString().slice(0, 16);
        res.render('editAuction', {auction: editAuction.rows[0], startTime: startTime, endTime: endTime, editStart: editStart})
      }
      catch(e){
        console.log('error: ', e)
        res.redirect('back');
      }
    }
    loadEdit();
  })

  router.post('/edit/auction/:id', (req, res, next) => {
    async function saveEdit() {
      try {
        await db.query(`update auctions set description = $2, end_time = $3, opening_bid = $4, shipping_location = $5 where id = $1`,
          [req.params.id, req.body.description, req.body.end_time, req.body.opening_bid, req.body.shipping_location]);
        if (req.body.start_time){
          await db.query(`update auctions set start_time = $2 where id = $1`, [req.params.id, req.body.start_time]);
        }
        res.redirect(`/auction/${req.params.id}`);
      }
      catch (e) {
        console.log('error saving auction edit: ', e)
        res.redirect('back');
      }
    }
    saveEdit();
  })

  router.post('/auction/bid/:id', (req, res, next) => {
    async function makeBid() {
      try {
        console.log(req.params)
        const bidOn = await db.query('select end_time, opening_bid from auctions where id = $1', [req.params.id]);
        const highestBid = await db.query('select max(bid) as "highest" from bids where fk_auctions = $1', [req.params.id]);
        const timeNow = new Date();
        console.log('bidOn: ', bidOn)
        if ((bidOn.rows[0].end_time - timeNow) <= 0){
          res.send('Auction is over');
        }
        else if (req.body.bid_price <= parseFloat(highestBid.rows[0].highest)){
          res.send('Bid must be higher than current bid.');
        }
        else if (req.body.bid_price < bidOn.rows[0].opening_bid){
          res.send('Bid must not be lower than opening bid');
        } else {
          await db.query('insert into bids (fk_users, fk_auctions, bid, bid_time) values ($1, $2, $3, localtimestamp)',
          [req.user.id, req.params.id, req.body.bid_price]);
          console.log('made bid');
          res.redirect(`/auction/${req.params.id}`);
        }
      }
      catch (e) {
        console.log('error making bid: ', e)
        res.redirect('back');
      }
    }
    makeBid();
  })

  router.get('/delete/:auctionid', (req, res, next) => {
    async function deleteAll(){
      try {
        await db.query('delete from auctions where id = $1', [req.params.auctionid]);
        await db.query('delete from bids where fk_auctions = $1', [req.params.auctionid])
        res.redirect('/dashboard');
      }
      catch(e){
        console.log('error deleting: ', e);
        res.send("Couldn't delete.");
      }
    }
    deleteAll();
  });

  return router;
};

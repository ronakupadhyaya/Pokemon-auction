var express = require('express');
var router = express.Router();
var { monthString, getNiceDate } = require('../dateMethods');
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

  router.get('/dashboard', async function(req , res){
    var result;
    try{
      result = await db.query(`
        SELECT
          a.start_date  AS "start_date",
          a.opening_bid AS "opening_bid",
          p.image_url   AS "image_url",
          p.name        AS "name",
          p.type        AS "type"
          MAX(b.amount) AS "max_bid"
        FROM
          auctions a
            JOIN pokemon p
              ON a.fk_pokemon = p.id
            LEFT OUTER JOIN bids b
              ON b.fk_auctions = a.id
        GROUP BY
          a.id
      ;`);
    } catch(error){
      res.send('Error: ' + error);
      return;
    }
    console.log(result.rows[0].opening_bid);
    result = result.rows.map((data)=>{
      data.start_date = getNiceDate(data.start_date);
      if(!data.max_bid){
        data.max_bid = data.opening_bid;
      }
      return data;
    });
    res.render('dashboard',{username: req.user.username, auctions: result});
  });

  router.get('/profile', function(req , res){
    var user = Object.assign({},req.user,{edit: req.query.edit, error: req.query.error});
    delete user.password;
    delete user.id;
    res.render('profile', user);
  });

  router.post('/profile/update', async function(req, res){
    var error = false;
    if(!req.body.current_password){
      error = 'Current password is required to make changes.';
    }
    else if(req.body.current_password!==req.user.password){
      error = 'Incorrect password provided.';
    }
    else if (!req.body.username){
      error = 'Username must be non-empty.';
    }
    else if(req.body.password && !req.body.password2){
      error = 'Please re-type new password.';
    }
    else if(req.body.password !== req.body.password2){
      error = 'Passwords do not match.';
    }
    else if(req.body.username !== req.user.username){
      try{
        var result = await db.query(`
          SELECT
            username
          FROM
            users
          WHERE
            username = $1
        ;`,[req.body.username]);
      } catch(error){
        res.send('Error: ' + error);
        return;
      }
      if(result.length > 0){
        error = 'Username taken.';
      }
    }
    if(error){
      res.redirect(`/profile?edit=true&&error=${error}`);
    }
    else{
      var password = req.body.password || req.user.password;
      try {
        result = await db.query(`
          UPDATE
            users
          SET
            username    = $2,
            name_first  = $3,
            name_last   = $4,
            email       = $5,
            phone       = $6,
            street      = $7,
            city        = $8,
            state       = $9,
            country     = $10,
            zipcode     = $11,
            password    = $12
          WHERE
            username = $1;`, [
            req.user.username,
            req.body.username,
            req.body.name_first || null,
            req.body.name_last || null,
            req.body.email || null,
            req.body.phone || null,
            req.body.street || null,
            req.body.city || null,
            req.body.state || null,
            req.body.country || null,
            req.body.zipcode || null,
            password ]);
      } catch(error){
        res.send('Error: ' + error);
        return;
      }
      res.redirect(`/profile`);
    }
  });

  router.use('/profile',function(req, res){
    res.redirect('/profile');
  });

  router.get('/auction/new', async function(req, res){
    var result;
    try {
      result = await db.query(`
        SELECT
          DISTINCT name,
          type,
          id
        FROM
          pokemon
        ORDER BY
          name,
          type
      `);
    } catch(err){
      res.send('Error: ' + err);
    }
    res.render('newAuction',{'pokemon': result.rows, 'error': req.query.error});
  });

  router.post('/auction/new', async function(req, res){
    var error = false;
    if(!req.body.pokemon_id){
      error = "Please select a pokemon.";
      res.redirect(`/auction/new?error=${error}`);
    }
    var result;
    try {
      result = await db.query(`
        INSERT INTO
          auctions  ( id,       fk_users,     fk_pokemon,           start_date,   duration_days,          opening_bid,          reserve_price,          description,          shipping_from           )
        VALUES
                    ( DEFAULT,  $1,           $2,                   $3,           $4,                     $5,                   $6,                     $7,                   $8                      )
        RETURNING
          id
        AS
          id
      ;`,           [           req.user.id,  req.body.pokemon_id,  new Date(),   req.body.duration_days, req.body.opening_bid, req.body.reserve_price, req.body.description, req.body.shipping_from  ]);
    } catch(err){
      res.send('Error: ' + err);
      return;
    }
    var id = result.rows[0].id;
    res.redirect(`/auction/${id}`);
  });

  router.get('/auction/:id', async function(req,res){
    var result;
    var edit = req.query.edit || false;
    var canEdit = true;
    try{
      result = await db.query(`
        SELECT
          a.fk_users AS "owner_id",
          a.start_date AS "start_date",
          a.duration_days AS "duration_days",
          a.opening_bid AS "opening_bid",
          a.reserve_price AS "reserve_price",
          a.description AS "auction_description",
          a.shipping_from AS "shipping_from",
          p.name AS "name",
          p.type AS "type",
          p.image_url AS "image_url",
          p.description AS "pokemon_description"
        FROM
          auctions a
        JOIN
          pokemon p
            ON a.fk_pokemon = p.id
        WHERE
          a.id = $1
      ;`,[req.params.id]);
    } catch(err){
      res.send('Error: ' + err);
      return;
    }
    result = result.rows[0];
    var startDate = parseInt(result.start_date.getTime());
    var endDate = startDate + parseInt(result.duration_days)*86400000;
    var now = parseInt(new Date().getTime());
    if(now >= endDate){
      canEdit = false;
    }
    if(req.user.id !== result.owner_id){
      delete result.reserve_price;
      canEdit = false;
    }
    delete result.owner_id;
    res.render('auction',Object.assign({},result,{"edit":edit,"error":req.query.error, "canEdit": canEdit, "id":req.params.id}));
  });

  return router;
};

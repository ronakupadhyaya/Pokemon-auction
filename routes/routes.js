var express = require('express');
var router = express.Router();

module.exports = function(db) {
  router.get('/', (req, res, next) => {
    res.render('index', {title: 'PokeBay'});
  });

  // YOUR CODE HERE

  router.get('/profile', (req, res) => {
    // const requser = {first_name: 'jeff', last_name: 'tang', street_adress: '450 9th St.', city: 'San Francisco', state: 'CA', zipcode: 94109, username: 'tangsauce', password: 'baseball', email: 'jeff@gmail.com', phone: 5134263380};
    // const user = _.filter(requser, (val, key) => (key !== 'password'));
    console.log(req.user.street_address); // only renders '450'
    res.render('profile', {title: 'Profile', user: req.user});
  });

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
  return router;
};

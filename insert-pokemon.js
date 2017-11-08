"use strict";

var pokemon = require('./data/pokemon.json');

// Insert Pokemon into your PokeBay database
var pool = require('./pool');
Promise.all(pokemon.map(p => pool.query(`
  INSERT INTO pokemon (name, image_url, type)
  VALUES ($1, $2, $3);
`, [p.name, p.image_url, p.type])))
  .then(() => console.log('SUCCESS'))
  .catch(err => console.log('ERROR', err));

"use strict";

var pokemon = require('./data/pokemon.json');
var pool = require('./pool');

// Insert Pokemon into your PokeBay database
// YOUR CODE HERE

function insertPokemon(p) {
  console.log(p);
  console.log(p.name);
  return pool.query('INSERT INTO pokemon (name, picture, type) VALUES ($1, $2, $3)', [p.name, p.image_url, p.type]);
}

var pokemonPromises = pokemon.map(p => insertPokemon(p));
Promise.all(pokemonPromises)
    .then(() => {
        console.log('Saved all users!');
    });

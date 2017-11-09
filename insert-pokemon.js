"use strict";

const pokemon = require('./data/pokemon.json');
var pool = require('./pool');

function insertPokemon(name, url, type) {
  return pool.query(`INSERT INTO Pokemon_catalog (name, image_url, type) VALUES ($1, $2, $3)`, [name, url, type])
}


var pokemonPromises = pokemon.map((x) => insertPokemon(x.name, x.image_url, x.type));
Promise.all(pokemonPromises)
      .then(() => console.log('all pokemon saved!'));

// Insert Pokemon into your PokeBay database
// YOUR CODE HERE

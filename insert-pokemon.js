"use strict";
var pool = require('./pool.js');
var pokemon = require('./data/pokemon.json');

// Insert Pokemon into your PokeBay database
// YOUR CODE HERE

function insertPokemon(name, whos_that_pokemon, type) {
  return pool.query('INSERT INTO pokemon (name, whos_that_pokemon, type) VALUES ($1, $2, $3);', [name, whos_that_pokemon, type]);
}

var pokemonPromises = pokemon.map(po => insertPokemon(po.name, po.image_url, po.type));
console.log('POKE', pokemon);
console.log('POKE PROMISE', pokemonPromises);
Promise.all(pokemonPromises)
  .then(() => {
    console.log('Saved all users!');
  })
  .catch((err) => {
    console.log('Error', err);
  });

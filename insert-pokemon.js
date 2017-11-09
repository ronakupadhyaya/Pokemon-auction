"use strict";

var pokemons = require('./data/pokemon.json');
var pg = require('pg');
var pool = require('./pool');
// Insert Pokemon into your PokeBay database
// YOUR CODE HERE

function insertUser(pokemon) {
  console.log('pokemon: ', pokemon);
    return pool.query('INSERT INTO pokemon (name, picture, type) VALUES ($1, $2, $3)', [pokemon.name, pokemon.image_url, pokemon.type]);
}

var pokePromises = pokemons.map(pokemon => insertUser(pokemon));
Promise.all(pokePromises)
    .then(() => {
        console.log('Saved all users!');
    });

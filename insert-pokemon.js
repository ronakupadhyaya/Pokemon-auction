"use strict";

var pokemon = require('./data/pokemon.json');
var pool = require('./pool');

// Insert Pokemon into your PokeBay database
// YOUR CODE HERE
function insertPokemon(pokemon) {
  return pool.query('INSERT INTO pokemon (name, image_url, type) VALUES ($1, $2, $3)', [pokemon.name, pokemon.image_url, pokemon.type]);
}

// pool.query("DROP TABLE pokemon");

// pool.query("CREATE TABLE pokemon (name TEXT, image_url TEXT, type TEXT)")
//   .then(function(table){
//     console.log('table result', table);
//     var pokePromises = pokemon.map(monster => insertPokemon(monster));
//     Promise.all(pokePromises)
//       .then(function(result){
//         console.log('Saved all pokemon!', result);
//       });
//   })
//   .catch(function(err){
//     console.log('error creating table', err);
//   });

var pokePromises = pokemon.map(monster => insertPokemon(monster));
Promise.all(pokePromises)
  .then(function(result){
    console.log('Saved all pokemon!', result);
  });

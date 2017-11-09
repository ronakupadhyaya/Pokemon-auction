"use strict";

var pokemon = require('./data/pokemon.json');
var pool = require('./pool');
var users = [
  {
    username:'natedana',
    password:'pw'
  },
  {
    username:'jha',
    password:'pw'
  }
];
// Insert Pokemon into your PokeBay database

function newPokemon(pokemon) {
  return pool.query('INSERT INTO pokemon (name,image,type) VALUES ($1,$2,$3)', [pokemon.name, pokemon.image_url, pokemon.type]);
}
function newUser(user) {
  return pool.query('INSERT INTO users (username, password) VALUES ($1,$2)', [ user.username, user.password]);
}

var pokemonAdd = pokemon.map(mon => newPokemon(mon));
Promise.all(pokemonAdd)
  .then(() => {
    console.log('Saved all Pokemon!');
  })
  .catch(err => {
    console.log('Something went wrong with PKMN!\n',err);
  });
var userAdd = users.map(user => newUser(user));
Promise.all(userAdd)
  .then(() => {
    console.log('Saved all Users!');
  })
  .catch(err => {
    console.log('Something went wrong with Users!\n',err);
  });

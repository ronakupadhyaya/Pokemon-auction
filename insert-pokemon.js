"use strict";

const pool = require('./pool');

var pokemons = require('./data/pokemon.json');

function insertPokemon(pokemon) {
  return pool.query(`
    INSERT INTO
      pokemon (name, image_url, type)
    VALUES
      ($1, $2, $3)`,
      [pokemon.name, pokemon.image_url, pokemon.type]
  );
}

var pokemonPromises = pokemons.map(pokemon => insertPokemon(pokemon));

Promise.all(pokemonPromises)
  .then(() => {
    console.log('Saved all pokemon!');
  }
);

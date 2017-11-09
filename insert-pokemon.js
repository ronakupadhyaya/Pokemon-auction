"use strict";
const pool = require('./pool.js');
const pokemon = require('./data/pokemon.json');


// Insert Pokemon into your PokeBay database
Promise.all(pokemon.map((pokemon)=>(
  pool.query(`
    INSERT INTO pokemon ( name,  type,  image_url)
      VALUES            ( $1,    $2,    $3       )
  ;`,[pokemon.name,pokemon.type,pokemon.image_url])
)))
  .then(()=>console.log('Pokemon added to database.'))
  .catch((err)=>console.log('Error adding pokemon to database'));

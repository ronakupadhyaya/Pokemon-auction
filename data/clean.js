"use strict";

var pokemonArr = require('./pokemon-50.json');
console.log(JSON.stringify(pokemonArr.map(pokemon => {
  // pokemon.type.map({name, image_url, types} => { types[type] = (types[type] || 0) + 1; });
  return {
    name: pokemon.name,
    image_url: pokemon.image_url,
    type: pokemon.types[0]
  };
}), null, 2));

// var pokemonArr = require('./raw/pokemon.json');
// var types = {};
//
// console.log(JSON.stringify(pokemonArr.map(pokemon => {
//   pokemon.type.map(type => { types[type] = (types[type] || 0) + 1; });
//   return {
//     name: pokemon.name,
//     image_url: pokemon.ThumbnailImage,
//     types: pokemon.type
//   };
// }), null, 2));

// console.log(types);

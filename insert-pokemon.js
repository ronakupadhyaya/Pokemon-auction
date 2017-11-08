"use strict";

// var pokemon = require('./data/pokemon.json');
var pool = require('./pool.js');

//CREATE CATALOG AND LOAD ALL DATA/////////////////////////////////////////////////////////////////////////////////////////////////////////
function insertPokemon(pokemon) {
    return pool.query('INSERT INTO catalog (name, image, type) VALUES ($1, $2, $3)',
    [pokemon.name, pokemon.image_url, pokemon.type]);
}

var userPromises = pokemon.map(each => insertPokemon(each));

pool.query(`CREATE TABLE catalog (pokemonid serial, name varchar, image varchar, type varchar)`)
  .then(() => {
    Promise.all(userPromises)
        .then(() => {
            console.log('Saved all users!');
        });
  })

//CREATE OTHER TABLES LOAD DATA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
pool.query(`CREATE TABLE users (userid serial, first varchar, last varchar,
  username varchar, password varchar, email varchar, phone int, address varchar)`)
    .then(() => {
      console.log('Successfully created user table!')
    })
    .catch((err) => {
      console.log('Error making user table!', err)
    })

pool.query(`CREATE TABLE auctions (auctionid serial, pokemonid int, userid int, startdate timestamp,
  duration interval day, startingbid int, reserveprice int, status varchar)`)
    .then(() => {
      console.log('Successfully created user table!')
    })
    .catch((err) => {
      console.log('Error making auction table!', err)
    })

pool.query(`CREATE TABLE bids (bidid serial, auctionid int, userid int, bidtime timestamp, bidvalue int)`)
    .then(() => {
      console.log('Successfully created user table!')
    })
    .catch((err) => {
      console.log('Error making bid table!', err)
    })

//TABLE OUTLINE/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// user (userid, first, last, username, password, email, phonenumber, address)
// catalog (pokemonid, name, picture, type)
// auction (auctionid, pokemonid, userid, startdate, duration, startingbid, reserveprice, status)
// bids(bidid, auctionid, userid, bidtime, bidvalue)

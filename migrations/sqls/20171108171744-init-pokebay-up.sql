CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name_first VARCHAR,
  name_last VARCHAR,
  street_address VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  state VARCHAR NOT NULL,
  zipcode INT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  phone_number INT
);

CREATE TABLE pokemon (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  picture VARCHAR,
  type VARCHAR
);

CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  fk_host INT NOT NULL,
  fk_pokemon INT NOT NULL,
  opening_bid INT,
  start_date DATE,
  create_date DATE,
  length INT NOT NULL,
  street_address VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  state VARCHAR NOT NULL,
  zipcode INT NOT NULL,
  reserve_price INT,
  description TEXT
);

CREATE TABLE bids (
  time DATE,
  fk_auction INT NOT NULL,
  fk_user INT NOT NULL,
  amount INT
);

CREATE TABLE watchlist (
  fk_user INT NOT NULL,
  fk_auction INT NOT NULL
);
/* Replace with your SQL commands */

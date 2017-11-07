/* Replace with your SQL commands */
CREATE TABLE users (
  id serial primary key,
  first_name varchar not null,
  last_name varchar not null,
  street_address varchar,
  city varchar,
  state varchar,
  zipcode int,
  username varchar not null,
  password varchar not null,
  email varchar not null,
  phone_number int
);

CREATE TABLE pokemon (
  pokedex_number serial primary key,
  name varchar not null,
  whos_that_pokemon varchar not null,
  type varchar not null
);

CREATE TABLE auction (
  auction_id serial primary key,
  fk_seller varchar not null,
  fk_pokemon varchar not null,
  start_date timestamp not null,
  opening_bid int not null,
  reserve_price int not null,
  duration timestamp not null,
  shipping_from varchar not null,
  description varchar,
  fk_bids varchar
);

CREATE TABLE bid (
  bid_id serial primary key,
  fk_auction_id int not null,
  fk_auction_name varchar not null,
  fk_bidder_id int not null,
  fk_bidder varchar not null,
  bid_amount int not null
);

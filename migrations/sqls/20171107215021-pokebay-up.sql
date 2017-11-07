create table users (
  id serial primary key,
  first_name text,
  last_name text,
  street_address text,
  city text,
  state text,
  zipcode int,
  username text,
  password text,
  email text,
  phone int
);

create table pokemon (
  id serial primary key,
  name text,
  picture text,
  type text
);

create table auctions (
  id serial primary key,
  fk_users int,
  fk_pokemon int,
  opening_bid decimal,
  reserve_price decimal,
  duration int,
  shipping_location text,
  description text,
  start int,
  creation int
);

create table bids (
  id serial primary key,
  fk_auctions int,
  fk_users int,
  bid decimal,
  bid_time int
);

create table watchlists (
  id serial primary key,
  fk_auctions int,
  fk_users int
);

/* Replace with your SQL commands */
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT,
  password TEXT,
  email varchar,
  phone int,
  street varchar,
  city varchar,
  state varchar,
  country varchar,
  postal int
);

CREATE TABLE pokemon (
  id SERIAL PRIMARY KEY,
  name text,
  picture varchar,
  type varchar
);

create table auctions (
  id SERIAL PRIMARY KEY,
  pokemon_id int,
  o_bid int,
  r_price int,
  length int,
  f_location varchar,
  description varchar,
  user_id int,
  createdAt timestamp,
  status int,
  startAt timestamp,
  endAt timestamp
);

create table bids(
  id SERIAL PRIMARY KEY,
  amount int,
  userId int,
  bidMade timestamp,
  inAuction int
);

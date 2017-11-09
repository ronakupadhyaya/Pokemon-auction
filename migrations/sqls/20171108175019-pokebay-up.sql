/* Replace with your SQL commands */
/* Replace with your SQL commands */
CREATE TABLE user_db (
  id SERIAL PRIMARY KEY,
  username TEXT,
  password TEXT,
  email TEXT,
  phone TEXT,
  street_address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  zipcode TEXT
);

CREATE TABLE pokemon_catalog (
  id SERIAL PRIMARY KEY,
  name TEXT,
  image_url TEXT,
  type TEXT
);

CREATE TABLE create_auction (
  owner_user_id INT,
  pokemon_name TEXT,
  pokemon_type TEXT,
  image_url TEXT,
  starting_bid TEXT,
  reserve TEXT,
  shipping_location TEXT,
  auction_length TEXT,
  description TEXT,
  pokemon_id INT
);

CREATE TABLE view_auction (
  logged_user_id INT,
  city_owner TEXT,
  pokemon_id INT,
  opening_bid INT,
  status TEXT,
  start TEXT,
  time_left TEXT,
  highest_bid TEXT,
  auction_length INT,
  shipping_location TEXT,
  description TEXT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  name_first TEXT,
  name_last TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  zipcode TEXT,
  email TEXT,
  phone TEXT
);

CREATE TABLE pokemon (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  image_url TEXT,
  description TEXT
);

CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  fk_users INT NOT NULL,
  fk_pokemon INT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  duration_days INT NOT NULL,
  opening_bid DECIMAL DEFAULT 0.0,
  reserve_price DECIMAL DEFAULT 0.01,
  description TEXT,
  shipping_from TEXT
);

CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  fk_users INT NOT NULL,
  fk_auctions INT NOT NULL,
  bid_time TIMESTAMP NOT NULL,
  amount DECIMAL NOT NULL
);

CREATE TABLE watchlists (
  id SERIAL PRIMARY KEY,
  fk_users INT NOT NULL,
  fk_auctions INT NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  name_first TEXT,
  name_last TEXT,
  street_address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  zipcode INT,
  email TEXT,
  phone TEXT
);

CREATE TABLE pokemon (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  type TEXT,
  description TEXT
);

CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  pokemon_id INT NOT NULL,
  seller_id INT NOT NULL,
  start DATE NOT NULL,
  auction_length INT NOT NULL,
  opening_bid DECIMAL DEFAULT 0.0,
  reserve_price DECIMAL DEFAULT 0.01,
  description TEXT
);

CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  auction_id INT NOT NULL,
  bid_amount DECIMAL NOT NULL,
  bid_time TIMESTAMP NOT NULL
);

CREATE TABLE watchlists (
  user_id INT NOT NULL,
  auction INT NOT NULL
);

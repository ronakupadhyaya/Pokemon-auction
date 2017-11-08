CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT,
  email TEXT,
  phone TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal TEXT
);

CREATE TABLE pokemon (
  id SERIAL PRIMARY KEY,
  name TEXT,
  image_url TEXT,
  type TEXT
);

CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  fk_user_id INT REFERENCES users,
  fk_pokemon_id INT REFERENCES pokemon,
  opening_bid DECIMAL,
  reserve_price DECIMAL,
  length INT,
  shipping_location TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  fk_auction_id INT REFERENCES auctions,
  fk_user_id INT REFERENCES users,
  amount DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE watchlists (
  id SERIAL PRIMARY KEY,
  fk_user_id INT REFERENCES users,
  fk_auction_id INT REFERENCES auctions
);

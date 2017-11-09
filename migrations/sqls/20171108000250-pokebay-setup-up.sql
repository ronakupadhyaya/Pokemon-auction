CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name_first TEXT,
  name_last TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  zipcode INT,
  email TEXT,
  phone TEXT,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE login (
  id SERIAL PRIMARY KEY,
  username TEXT
);

CREATE TABLE pokemon (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  picture TEXT,
  type TEXT
);

CREATE TABLE auction (
  id SERIAL PRIMARY KEY,
  fk_pokemon INT,
  fk_users INT,
  opening_bid DECIMAL,
  reserve_price DECIMAL,
  street TEXT,
  city TEXT,
  state TEXT,
  zipcode TEXT,
  description TEXT,
  start_date DATE,
  start_time TIME,
  end_date DATE,
  end_time TIME
);

CREATE TABLE bid (
  id SERIAL PRIMARY KEY,
  fk_users INT,
  fk_auctions INT,
  amount DECIMAL
);

CREATE TABLE watches (
  id SERIAL PRIMARY KEY,
  fk_users INT,
  fk_auctions INT
);

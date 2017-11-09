CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  email TEXT,
  phone TEXT
);

CREATE TABLE pokemon (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  type TEXT
);

CREATE TABLE auction (
  id SERIAL PRIMARY KEY,
  fk_pokemon INT,
  fk_users INT,
  bid DECIMAL,
  reserve DECIMAL,
  datetime_start TEXT,
  datetime_end TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  description TEXT
);

CREATE TABLE bid (
  id SERIAL PRIMARY KEY,
  fk_users INT,
  fk_auction INT,
  value INT
);

CREATE TABLE watch (
  id SERIAL PRIMARY KEY,
  fk_users INT,
  fk_auction INT
);

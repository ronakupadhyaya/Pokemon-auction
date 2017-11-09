/* Replace with your SQL commands */

create table users (
    id serial primary key,
    street varchar,
    city varchar,
    state varchar,
    zipcode INT,
    country varchar,
    username varchar,
    pword varchar,
    email varchar,
    phone varchar
);

create table pokemon (
    id serial primary key,
    picture varchar,
    name_poke varchar,
    type_poke varchar
);

create table auction (
    id serial primary key,
    user_id int,
    poke_id int,
    opening_bid int,
    reserve_price int,
    auction_created timestamp,
    auction_start timestamp,
    auction_end timestamp,
    descrip text,
    status text,
    ship_address varchar
);

create table auction_bids (
    id serial primary key,
    auction_id int,
    owner_user_id int,
    bid_amount int,
    bid_made timestamp,
    bidder_user_id int
);

create table watch_list (
    id serial primary key,
    user_id int,
    auction_id int
);
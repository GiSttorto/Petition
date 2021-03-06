DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(100) NOT NULL,
    last VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(4500) NOT NULL UNIQUE
);


CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id)
);


CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    age VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    url VARCHAR(1000),
    user_id INTEGER NOT NULL REFERENCES users(id)
);

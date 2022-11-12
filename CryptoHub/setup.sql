CREATE DATABASE cryptohub;
\c cryptohub;
CREATE TABLE users (
	username VARCHAR(25) UNIQUE,
	password CHAR(60)
);
INSERT INTO users (username, password) VALUES ('nd596', 'testPass');

CREATE TABLE portfolio1 (
	username VARCHAR(25) UNIQUE,
	coin CHAR(10),
	amount INT,
	value DECIMAL(10,2),
	date TIMESTAMP
);
INSERT INTO portfolio1 (username, coin, amount, value, date) VALUES ('nd596', 'bitcoin', 2, 20000, current_timestamp);

CREATE TABLE portfolio2 (
	username VARCHAR(25),
	coin CHAR(10),
	amount INT,
	value DECIMAL(10,2),
	date TIMESTAMP
);

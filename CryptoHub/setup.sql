CREATE DATABASE cryptohub;
\c cryptohub;
CREATE TABLE users (
	username VARCHAR(25) UNIQUE,
	password CHAR(60)
);
INSERT INTO users (username, password) VALUES ('nd596', 'testPass');

CREATE TABLE portfolio (
	username VARCHAR(25),
	portfolio CHAR(10),
	coin CHAR(10),
	amount INT,
	value DECIMAL(10,2),
	date TIMESTAMP
);
INSERT INTO portfolio (username, portfolio, coin, amount, value, date) VALUES ('nd596', 'Portfolio1', 'bitcoin', 2, 20000, current_timestamp);
INSERT INTO portfolio (username, portfolio, coin, amount, value, date) VALUES ('nd596', 'Portfolio2', 'ethereum', 1, 1500, current_timestamp);

CREATE TABLE portfolio1 (
	username VARCHAR(25),
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
INSERT INTO portfolio2 (username, coin, amount, value, date) VALUES ('nd596', 'bitcoin', 2, 20000, current_timestamp);
CREATE DATABASE cryptohub;
\c cryptohub;
CREATE TABLE users (
	username VARCHAR(25),
	password CHAR(60)
);
INSERT INTO users (username, password) VALUES ('nd596', 'testPass');

CREATE TABLE portfolio (
	username VARCHAR(25),
	coin CHAR(25),
	amount CHAR(25),
	value DECIMAL(10,2),
	date TIMESTAMP
)

CREATE TABLE portfolio2 (
	username VARCHAR(25),
	coin CHAR(25),
	amount CHAR(25),
	value DECIMAL(10,2),
	date TIMESTAMP
)

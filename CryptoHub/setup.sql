CREATE DATABASE cryptohub;
\c cryptohub;
CREATE TABLE users (
	username VARCHAR(25),
	password CHAR(60)
);
INSERT INTO users (username, password) VALUES ('nd596', 'testPass');

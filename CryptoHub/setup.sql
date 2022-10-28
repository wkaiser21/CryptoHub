CREATE DATABASE CryptoHub;
\c CryptoHub;
CREATE TABLE Users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(25),
	pass VARCHAR(50),
);
INSERT INTO Users (id, name, pass) VALUES ('nd596', 'Nizom Djuraev', 'testPass');

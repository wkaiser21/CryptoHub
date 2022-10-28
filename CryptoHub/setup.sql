CREATE DATABASE exercise5a;
\c exercise5a;
CREATE TABLE animals (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50),
	age INT,
	species VARCHAR(25)
);
INSERT INTO animals (name, age, species) VALUES ('Test', 77, 'test');

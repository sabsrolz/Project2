<<<<<<< HEAD

=======
DROP DATABASE IF EXISTS StockDB;
CREATE DATABASE StockDB;
USE StockDB;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255)NOT NULL,
    password VARCHAR(255)NOT NULL,
    money INT NOT NULL,
	PRIMARY KEY(ID)
);
>>>>>>> 5c476079c79a0a0195242fcc4ebf3b5f6b2b899e

CREATE TABLE transactions (
	id INT NOT NULL,
    transaction INT NOT NULL,
    ticker VARCHAR(255) NOT NULL
);
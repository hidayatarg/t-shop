-- Drop tables
Drop table reviews;
Drop table images;
Drop table products;
Drop table categories;
Drop table sellers;

-- Create tables
CREATE TABLE categories(
	id serial NOT NULL,
	name VARCHAR(30),
	description VARCHAR(400),
	created_date TIMESTAMP,
	created_by VARCHAR(30),
	updated_date TIMESTAMP,
	updated_by VARCHAR(30),
	is_active bool,
	PRIMARY KEY(id)
);

CREATE TABLE sellers(
	id serial NOT NULL,
	name VARCHAR(50),
	description VARCHAR(400),
	address VARCHAR(200),
	created_date TIMESTAMP,
	created_by VARCHAR(30),
	updated_date TIMESTAMP,
	updated_by VARCHAR(30),
	is_active bool,
	PRIMARY KEY (id)
);

CREATE TABLE products(
	id serial NOT NULL,
	name VARCHAR(30),
	price smallint,
	description VARCHAR(400),
	rating smallint,
	category_id int,
	seller_id int,
	user_id int,
    stock_amount int,
	created_date TIMESTAMP,
	created_by VARCHAR(30),
	updated_date TIMESTAMP,
	updated_by VARCHAR(30),
	is_active bool,
	PRIMARY KEY (id),
	FOREIGN KEY (category_id) REFERENCES categories(id),
	FOREIGN KEY (seller_id) REFERENCES sellers(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reviews(
    id serial NOT NULL,
	name VARCHAR(50),
	comment VARCHAR(200),
	rating smallint,
    product_id int,
	created_date TIMESTAMP,
	created_by VARCHAR(30),
	updated_date TIMESTAMP,
	updated_by VARCHAR(30),
	is_active bool,
	PRIMARY KEY (id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE images(
    id serial NOT NULL,
	name VARCHAR(30),
	url VARCHAR(200),
    product_id int,
	created_date TIMESTAMP,
	created_by VARCHAR(30),
	updated_date TIMESTAMP,
	updated_by VARCHAR(30),
	is_active bool,
	PRIMARY KEY (id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE users(
    id serial NOT NULL,
	firstname VARCHAR(30),
	lastname VARCHAR(30),
	password VARCHAR,
	avatar VARCHAR(200),
	email VARCHAR(200),
	created_date TIMESTAMP,
	is_active bool,
	role VARCHAR(30),
	reset_password_token VARCHAR,
	reset_password_expire TIMESTAMP
);

-- Insert data to tables
INSERT INTO categories(
	name, description, created_date, created_by, is_active)
	VALUES 
	 ( 'Home Devices', null, Now(), 'Hidayat Arghandabi', true),
	 ( 'Car', null,Now(), 'Hidayat Arghandabi', true),
	 ( 'Motor Bike',null,Now(), 'Hidayat Arghandabi', true);


-- Add user_id column to products table in psql
ALTER TABLE products ADD user_id int
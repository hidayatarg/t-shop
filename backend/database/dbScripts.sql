CREATE TABLE categories(
	id serial NOT NULL,
	name VARCHAR(30),
	description VARCHAR(400),
	created_date TIMESTAMP,
	created_by VARCHAR(30),
	is_active bool,
	PRIMARY KEY(id)
);

CREATE TABLE sellers(
	id serial NOT NULL,
	name VARCHAR(50),
	description VARCHAR(400),
	address VARCHAR(200),
	created_on TIMESTAMP,
	created_by VARCHAR(30),
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
    stock_amount int,
	created_date TIMESTAMP,
	created_by VARCHAR(30),
	is_active bool,
	PRIMARY KEY (id),
	FOREIGN KEY (category_id) REFERENCES categories(id),
	FOREIGN KEY (seller_id) REFERENCES sellers(id)

);

CREATE TABLE reviews(
    id serial NOT NULL,
	name VARCHAR(50),
	comment VARCHAR(200),
	rating smallint,
    product_id int,
	created_date TIMESTAMP,
	created_by VARCHAR(30),
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
	is_active bool,
	PRIMARY KEY (id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

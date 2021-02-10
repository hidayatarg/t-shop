```sql
CREATE TABLE categories(
    id serial NOT NULL,
    name VARCHAR(30),
    description VARCHAR(400),
    created_on TIMESTAMP,
    created_by VARCHAR(30),
    is_active bool,
    PRIMARY KEY(id)
);

CREATE TABLE products(
    id serial NOT NULL,
    name VARCHAR(30),
    price smallint,
    description VARCHAR(400),
    rating smallint,
    category_id smallint,
    created_on TIMESTAMP,
    created_by VARCHAR(30),
    is_active bool,
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

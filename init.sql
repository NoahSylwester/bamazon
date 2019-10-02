-- this script will initialize an appropriate database for the other files to work from, with placeholder values

DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Salmon", "Meat", 10, 200),
("Ahi ahi", "Meat", 15, 150),
("Halibut", "Meat", 7, 200),
("Shrimp", "Meat", 5, 500),
("Cod", "Meat", 8, 200),
("Swordfish", "Meat", 20, 20),
("Eel", "Meat", 13, 100),
("Tuna", "Meat", 9, 125),
("Raincoat", "Clothing", 40, 50),
("Toothpaste", "Pharmacy", 5, 75);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(50) NOT NULL,
  over_head_costs INT NOT NULL,
  product_sales INT NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs, product_sales)
VALUES
("Meat", 10000, 0),
("Clothing", 5000, 0),
("Pharmacy", 15000, 0)
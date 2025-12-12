/*
CS340 Project Step 6
Group 21
Kelsey Shanks 
Haruka Banin
12/05/2025
*/


SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;


--
-- Table structure for table `Nationalities`
--
CREATE OR REPLACE TABLE Nationalities (
	nationality_id INT NOT NULL AUTO_INCREMENT,
	nationality VARCHAR(45) NOT NULL,
	PRIMARY KEY (nationality_id)
);


--
-- Dumping data for table `Nationalities`
--
INSERT INTO Nationalities (nationality)
VALUES('Austrian'), ('German'), ('French');


--
-- Table structure for table `Composers`
--
CREATE OR REPLACE TABLE Composers (
	composer_id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(45) NOT NULL,
	middle_name VARCHAR(45),
	last_name VARCHAR(45) NOT NULL,
	birth_date DATE,
	death_date DATE,
	nationality_id INT NOT NULL,
	PRIMARY KEY (composer_id),
	CONSTRAINT fk_Composers_Nationalities 
	FOREIGN KEY (nationality_id) REFERENCES Nationalities(nationality_id) ON DELETE NO ACTION
);


--
-- Dumping data for table `Composers`
--
INSERT INTO Composers (
	first_name,
	middle_name,
	last_name,
	birth_date,
	death_date,
	nationality_id		
)
VALUES
(
	'Wolfgang',
	'Amadeus',
	'Mozart',
	'1756-01-27',
	'1791-12-05',
	(SELECT nationality_id FROM Nationalities WHERE nationality = 'Austrian')
),
(
	'Johann',
	'Sebastian',
	'Bach',
	'1685-03-31',
	'1750-07-28',
	(SELECT nationality_id FROM Nationalities WHERE nationality = 'German')
),
(
	'Ludwig',
	'van',
	'Beethoven',
	'1770-12-16',
	'1827-03-26',
	(SELECT nationality_id FROM Nationalities WHERE nationality = 'German')
),
(
	'Achille',
	'Claude',
	'Debussy',
	'1862-08-22',
	'1918-03-25',
	(SELECT nationality_id FROM Nationalities WHERE nationality = 'French')
);


--
-- Table structure for table `Composition_Types`
--
CREATE OR REPLACE TABLE Composition_Types (
	composition_type_id INT NOT NULL AUTO_INCREMENT,
	composition_type VARCHAR(45) NOT NULL,
	PRIMARY KEY (composition_type_id)
);


--
-- Dumping data for table `Composition_Types`
--
INSERT INTO Composition_Types (composition_type)
VALUES 
('Symphony'),
('Unaccompanied'),
('Concerto'),
('Oratorio'),
('Mass'),
('Chamber Music'),
('Suite');


--
-- Table structure for table `Styles`
--
CREATE OR REPLACE TABLE Styles (
	style_id INT NOT NULL AUTO_INCREMENT,
	style VARCHAR(45) NOT NULL,
	PRIMARY KEY (style_id)
);


--
-- Dumping data for table `Styles`
--
INSERT INTO Styles (style)
VALUES
('Folk'),
('Medieval'),
('Baroque'),
('Classical'),
('Romantic'),
('Contemporary'),
('Modern');


--
-- Table structure for table `Publishers`
--
CREATE OR REPLACE TABLE Publishers (
	publisher_id INT NOT NULL AUTO_INCREMENT,
	publisher_name VARCHAR(255) NOT NULL,
	phone_number VARCHAR(10) NOT NULL,
	contact_name VARCHAR(45) NOT NULL,
	email VARCHAR(255) NOT NULL,
	PRIMARY KEY (publisher_id)
);


--
-- Dumping data for table `Publishers`
--
INSERT INTO Publishers (
	publisher_name,
	phone_number,
	contact_name,
	email
)
VALUES
(
	'Bärenreiter',
	'2129483762',
	'Clara Mendel',
	'clara.mendel@barenreiter.com'
),
(
	'G. Henle Verlag',
	'3105428091',
	'Julian Rivera',
	'julian.rivera@henle.com'
),
(
	'Dover Publications',
	'5036712298',
	'Naomi Ishikawa',
	'naomi.ishikawa@doverpublications.com'
),
(
	'Alfred Music',
	'6463189047',
	'Evan Laurent',
	'evan.laurent@alfredmusic.com'
);


--
-- Table structure for table `Scores`
--
CREATE OR REPLACE TABLE Scores (
	score_id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(255) NOT NULL,
	composer_id INT NOT NULL,
	publisher_id INT NOT NULL,
	composition_type_id INT NOT NULL,
	style_id INT NOT NULL,
	price DECIMAL(9,2) NOT NULL,
	PRIMARY KEY (score_id),
	CONSTRAINT fk_Scores_Composers 
	FOREIGN KEY (composer_id) REFERENCES Composers(composer_id) ON DELETE NO ACTION,
	CONSTRAINT fk_Scores_Publishers 
	FOREIGN KEY (publisher_id) REFERENCES Publishers(publisher_id) ON DELETE NO ACTION,
    CONSTRAINT fk_Scores_Composition_Types
    FOREIGN KEY (composition_type_id) REFERENCES Composition_Types(composition_type_id) ON DELETE NO ACTION,
    CONSTRAINT fk_Scores_Styles 
	FOREIGN KEY (style_id) REFERENCES Styles(style_id) ON DELETE NO ACTION
);


--
-- Dumping data for table `Scores`
--
INSERT INTO Scores (
    title,
    composer_id,
    publisher_id,
    composition_type_id,
    style_id,
    price
)
VALUES
(	
    'St. Matthew Passion, BWV 244',
    (SELECT composer_id FROM Composers WHERE first_name = 'Johann' AND middle_name = 'Sebastian' AND last_name = 'Bach'),
    (SELECT publisher_id FROM Publishers WHERE publisher_name = 'Dover Publications'),
    (SELECT composition_type_id FROM Composition_Types WHERE composition_type = 'Oratorio'),
    (SELECT style_id FROM Styles WHERE style = 'Baroque'),
    14.95
),
(	
    'Flute Concerto in G Major, K.313',
    (SELECT composer_id FROM Composers WHERE first_name = 'Wolfgang' AND middle_name = 'Amadeus' AND last_name = 'Mozart'),
    (SELECT publisher_id FROM Publishers WHERE publisher_name = 'Bärenreiter'),
    (SELECT composition_type_id FROM Composition_Types WHERE composition_type = 'Concerto'),
    (SELECT style_id FROM Styles WHERE style = 'Classical'),
    24.95
),
(	
    'Syrinx, L. 129',
    (SELECT composer_id FROM Composers WHERE first_name = 'Achille' AND middle_name = 'Claude' AND last_name = 'Debussy'),
    (SELECT publisher_id FROM Publishers WHERE publisher_name = 'G. Henle Verlag'),
    (SELECT composition_type_id FROM Composition_Types WHERE composition_type = 'Unaccompanied'),
    (SELECT style_id FROM Styles WHERE style = 'Romantic'),
    8.95
),
(	
    'Symphony No. 9 in D minor, Op. 125',
    (SELECT composer_id FROM Composers WHERE first_name = 'Ludwig' AND middle_name = 'van' AND last_name = 'Beethoven'),
    (SELECT publisher_id FROM Publishers WHERE publisher_name = 'Alfred Music'),
    (SELECT composition_type_id FROM Composition_Types WHERE composition_type = 'Symphony'),
    (SELECT style_id FROM Styles WHERE style = 'Romantic'),
    73.00
);


--
-- Table structure for table `Customers`
--
CREATE OR REPLACE TABLE Customers (
	customer_id int NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(45) NOT NULL,
	last_name VARCHAR(45) NOT NULL,
	phone_number VARCHAR(10) NOT NULL,
	email VARCHAR(255) NOT NULL,
	PRIMARY KEY (customer_id)
);


--
-- Dumping data for table `Customers`
--
INSERT INTO Customers (
	first_name, 
	last_name,
	phone_number,
	email
)
VALUES
(
	'Lena',
	'Hartwell',
	'4158293746',
	'lena.hartwell87@gmail.com'
),
(
	'Miguel',
	'Soto',
	'2064910823',
	'miguel.soto22@yahoo.com'
),
(
	'Ava',
	'Chen',
	'3126579048',
	'ava.chen.work@outlook.com'
),
(
	'Darius',
	'Patel',
	'9092445710',
	'darius.patel@protonmail.com'
);


--
-- Table structure for table `Orders`
--
CREATE OR REPLACE TABLE Orders (
	order_id int NOT NULL AUTO_INCREMENT,
    customer_id INT NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sale_amount DECIMAL(9,2),
    PRIMARY KEY (order_id),
    CONSTRAINT fk_Orders_Customers 
    FOREIGN KEY (customer_id) REFERENCES Customers (customer_id) ON DELETE NO ACTION
);


--
-- Dumping data for table `Orders`
--
INSERT INTO Orders (
	customer_id, 
	date, 
	sale_amount
)
VALUES
(
	(SELECT customer_id FROM Customers WHERE first_name = 'Ava' AND last_name = 'Chen' AND email = 'ava.chen.work@outlook.com'),
	'2025-03-12 14:35:00',
	NULL
),
(
	(SELECT customer_id FROM Customers WHERE first_name = 'Miguel' AND last_name = 'Soto' AND email = 'miguel.soto22@yahoo.com'),
	'2025-07-27 20:05:13',
	NULL
	
),
(
	(SELECT customer_id FROM Customers WHERE first_name = 'Lena' AND last_name = 'Hartwell' AND email = 'lena.hartwell87@gmail.com'),
	'2025-11-03 22:23:03',
	NULL
),
(
	(SELECT customer_id FROM Customers WHERE first_name = 'Darius' AND last_name = 'Patel' AND email = 'darius.patel@protonmail.com'),
	'2025-11-03 22:23:03',
	NULL
);


--
-- Table structure for table `Order_Items`
--
CREATE OR REPLACE TABLE Order_Items (
	order_item_id int NOT NULL AUTO_INCREMENT,
	order_id INT NOT NULL,
	score_id INT NOT NULL,
	quantity INT NOT NULL,
	unit_price DECIMAL(9,2) NOT NULL,
	line_total DECIMAL(9,2),
	PRIMARY KEY(order_item_id),
	CONSTRAINT fk_Order_Items_Orders 
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_Order_Items_Scores
    FOREIGN KEY (score_id) REFERENCES Scores(score_id) ON DELETE NO ACTION
);


--
-- Dumping data for table `Order_Items`
--
INSERT INTO Order_Items (
	order_id, 
	score_id, 
	quantity, 
	unit_price
)
VALUES
(
	(SELECT order_id FROM Orders WHERE customer_id = (SELECT customer_id FROM Customers WHERE first_name = 'Lena' AND last_name = 'Hartwell') AND date = '2025-11-03 22:23:03'),
	(SELECT score_id FROM Scores WHERE title = 'St. Matthew Passion, BWV 244'),
	1,
	(SELECT price FROM Scores WHERE title = 'St. Matthew Passion, BWV 244')
),
(
	(SELECT order_id FROM Orders WHERE customer_id = (SELECT customer_id FROM Customers WHERE first_name = 'Miguel' AND last_name = 'Soto') AND date = '2025-07-27 20:05:13'),
	(SELECT score_id FROM Scores WHERE title = 'Syrinx, L. 129'),
	3,
	(SELECT price FROM Scores WHERE title = 'Syrinx, L. 129')
),
(
	(SELECT order_id FROM Orders WHERE customer_id = (SELECT customer_id FROM Customers WHERE first_name = 'Ava' AND last_name = 'Chen') AND date = '2025-03-12 14:35:00'),
	(SELECT score_id FROM Scores WHERE title = 'Flute Concerto in G Major, K.313'),
	2,
	(SELECT price FROM Scores WHERE title = 'Flute Concerto in G Major, K.313')
),
(
	(SELECT order_id FROM Orders WHERE customer_id = (SELECT customer_id FROM Customers WHERE first_name = 'Ava' AND last_name = 'Chen') AND date = '2025-03-12 14:35:00'),
	(SELECT score_id FROM Scores WHERE title = 'Symphony No. 9 in D minor, Op. 125'),
	1,
	(SELECT price FROM Scores WHERE title = 'Symphony No. 9 in D minor, Op. 125')
);


--
-- Update data to the line_total in the 'Order_Items' table
--
UPDATE Order_Items
SET line_total = (quantity * unit_price);


--
-- Update data to the sale_amount in the 'Orders' table
UPDATE Orders
SET sale_amount = (SELECT SUM(line_total) FROM Order_Items WHERE Order_Items.order_id = Orders.order_id);


SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

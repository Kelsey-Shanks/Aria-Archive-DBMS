/*
CS340 Project Step 6
Group 21
Kelsey Shanks 
Haruka Banin
12/05/2025
*/


----------------------------------------- Delete Procedure: ----------------------------------------
-- Citation for the following code: 
-- Date: 11/18/2025
-- Adapted from example code that AI gave me and based on example code on Canvas
-- Degree of originality: Used generated code as an example.
-- Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149
-- Source URL: https://gemini.google.com/
-- If AI tools were used: Gemini
-- How do I shere one delete stored procedure with other tables
DROP PROCEDURE IF EXISTS sp_Delete;
DELIMITER //
CREATE PROCEDURE `sp_Delete`(IN p_TableName VARCHAR(50), IN p_ColumnName VARCHAR(50), IN p_IdValue INT)
BEGIN
    DECLARE error_message VARCHAR(255); 

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        IF @stmt_prepared = 1 THEN 
            DEALLOCATE PREPARE stmt; 
        END IF;
        RESIGNAL;
    END;

    START TRANSACTION;
        SET @sql_text = CONCAT('DELETE FROM ', p_TableName, ' WHERE ', p_ColumnName, ' = ?');

        PREPARE stmt FROM @sql_text;
        SET @stmt_prepared = 1;

        SET @id = p_IdValue;
        
        EXECUTE stmt USING @id;

        -- ROW_COUNT() returns the number of rows affected by the preceding statement.
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in', p_TableName,'for id: ', p_IdValue);
            -- Trigger custom error, invoke EXIT HANDLER
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;

    COMMIT;

END

DELIMITER ;


----------------------------------------- CREATE (INSERT) Procedures: ----------------------------------------
DROP PROCEDURE IF EXISTS sp_create_composer;
DELIMITER //
CREATE PROCEDURE sp_create_composer(																	-- label inputs and outputs 
	IN f_name_input VARCHAR(45),
	IN m_name_input VARCHAR(45),
	IN l_name_input VARCHAR(45),
	IN b_day_input DATE,
	IN d_day_input DATE NULL,
	IN nationality_input INT,
	OUT new_composer_id INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Composer not added.' AS Result;
	END;

	START TRANSACTION;
	INSERT INTO Composers (first_name, middle_name, last_name, birth_date, death_date, nationality_id)  -- inserts entry into Composers
	VALUES (
		f_name_input,
		m_name_input,
		l_name_input,
		b_day_input,
		d_day_input,
		nationality_input                                           
	);
	SET new_composer_id = LAST_INSERT_ID();																-- set composer ID for output
	COMMIT;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_create_score;
DELIMITER //
CREATE PROCEDURE sp_create_score(																		-- label inputs and outputs 
	IN title_input VARCHAR(255),
	IN c_name_input INT,
	IN p_name_input INT,
	IN c_type_input INT,
	IN style_input INT,
	IN price_input DECIMAL(9,2),
	OUT new_score_id INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Score not added.' AS Result;
	END;

	START TRANSACTION;
	INSERT INTO Scores (title, composer_id, publisher_id, composition_type_id, style_id, price)         -- inserts entry into Scores
	VALUES (
		title_input, 
		c_name_input,                                  
		p_name_input,                                  
		c_type_input,                                  
		style_input,                                  
		price_input
	);
	
	SET new_score_id = LAST_INSERT_ID();	
															
	COMMIT;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_create_publisher;
DELIMITER //
CREATE PROCEDURE sp_create_publisher(																	-- label inputs and outputs 
	IN p_name_input VARCHAR(255),
	IN p_number_input VARCHAR(10), 
	IN contact_name_input VARCHAR(255),
	IN email_input VARCHAR(255),
	OUT new_publisher_id INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Publisher not added.' AS Result;
	END;

	START TRANSACTION;
	INSERT INTO Publishers (publisher_name, phone_number, contact_name, email)                          -- inserts entry into Publishers
	VALUES (
		p_name_input,
		p_number_input,
		contact_name_input,
		email_input              
	);
	SET new_publisher_id = LAST_INSERT_ID();															-- set publisher ID for output
	COMMIT;

END //
DELIMITER ; 


DROP PROCEDURE IF EXISTS sp_create_customer;
DELIMITER //
CREATE PROCEDURE sp_create_customer(																	-- label inputs and outputs 
	IN f_name_input VARCHAR(45),
	IN l_name_input VARCHAR(45),
	IN phone_num_input VARCHAR(10),
	IN email_input VARCHAR(255),
	OUT new_customer_id INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Customer not added.' AS Result;
	END;

	START TRANSACTION;
	INSERT INTO Customers (first_name, last_name, phone_number, email)                                  -- inserts entry into Customers
	VALUES (
		f_name_input,
		l_name_input,
		phone_num_input,
		email_input
	);
	SET new_customer_id = LAST_INSERT_ID();																-- set customer ID for output
	COMMIT;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_create_order;
DELIMITER //
CREATE PROCEDURE sp_create_order(																		-- label inputs and outputs 
	IN customer_input INT,
	IN date_input DATETIME,
	OUT new_order_id INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Order not added.' AS Result;
	END;

	START TRANSACTION;
	INSERT INTO Orders (customer_id, date, sale_amount)                                                 -- inserts entry into Orders
	VALUES (
		customer_input,
		date_input,
		0.00           
	);
	SET new_order_id = LAST_INSERT_ID();																-- set order ID for output
	COMMIT;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_create_order_item;
DELIMITER //
CREATE PROCEDURE sp_create_order_item(
	IN order_input INT,
	IN score_input INT,
	IN quantity_input INT,
	OUT new_order_item_id INT
)
BEGIN
	DECLARE score_price DECIMAL(9,2);
	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Order Item not added.' AS Result;
	END;

	-- Look up the price of the score
	SELECT price INTO score_price
    FROM Scores
    WHERE score_id = score_input;

    -- Handle case where price lookup fails
    IF score_price IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Score not found or price is missing.';
    END IF;

	START TRANSACTION;
	INSERT INTO Order_Items (order_id, score_id, quantity, unit_price, line_total)                      -- inserts entry into Order_Items
	VALUES (
		order_input,                                                                                       
		score_input,                                                                                              
		quantity_input,                                                                                            
		score_price,
		quantity_input * score_price                                    
	)
	-- set order_items ID for output
	SET new_order_item_id = LAST_INSERT_ID();	
	
	-- Update the sale_amount in Orders
	UPDATE Orders
    SET sale_amount = (
        SELECT SUM(line_total) FROM Order_Items WHERE order_id = order_input
    )
    WHERE order_id = order_input;															
	COMMIT;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_create_nationality;
DELIMITER //
CREATE PROCEDURE sp_create_nationality(																	-- label input and output
	IN nationality_input VARCHAR(45),
	OUT new_nationality_id INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Nationality not added.' AS Result;
	END;

	START TRANSACTION;
	INSERT INTO Nationalities (nationality)                                                             -- inserts entry into Nationalities
	VALUES (nationality_input);
	SET new_nationality_id = LAST_INSERT_ID();															-- set nationality_id for output
	COMMIT;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_create_style;
DELIMITER //
CREATE PROCEDURE sp_create_style(																		-- label input and output
	IN style_input VARCHAR(45),
	OUT new_style_id INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Style not added.' AS Result;
	END;

	START TRANSACTION;
	INSERT INTO Styles (style)                                                                          -- inserts entry into Styles
	VALUES (style_input);
	SET new_style_id = LAST_INSERT_ID();																-- set style_id for output
	COMMIT;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_create_composition_type;
DELIMITER //
CREATE PROCEDURE sp_create_composition_type(															-- label input and output
	IN c_type_input VARCHAR(45),
	OUT new_c_type_id INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Composition type not added.' AS Result;
	END;

	START TRANSACTION;
	INSERT INTO Composition_Types (composition_type)                                                    -- inserts entry into Composition_Types 
	VALUES (c_type_input);
	SET new_c_type_id = LAST_INSERT_ID();																-- set composition_type_id for output
	COMMIT;

END //
DELIMITER ;


------------------------------------------------- UPDATE Procedures ------------------------------------------------
DROP PROCEDURE IF EXISTS sp_update_composer;
DELIMITER //
CREATE PROCEDURE sp_update_composer(																	-- label input and output
	IN composer_id_selected INT,					
	IN d_day_input DATE																					-- only death date can be updated and changed!
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Composer not updated.' AS Result;
	END;

	START TRANSACTION;
	UPDATE Composers                                                                        			-- updates date
    SET death_date = d_day_input                                                             		
	WHERE composer_id = composer_id_selected;
	COMMIT;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_update_score;
DELIMITER //
CREATE PROCEDURE sp_update_score(																		-- label input and output
	IN score_id_selected INT,					
	IN price_input DECIMAL(9,2)																			-- only price can be updated and changed!
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Score not updated.' AS Result;
	END;

	START TRANSACTION;
	UPDATE Scores
	SET price = price_input																				-- update price
	WHERE score_id = score_id_selected;
	COMMIT;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_update_publisher;
DELIMITER //
CREATE PROCEDURE sp_update_publisher(																	-- label input and output
	IN publisher_id_selected INT,	
	IN phone_num_input VARCHAR(10),
	IN contact_name_input VARCHAR(45),				
	IN email_input VARCHAR(255)																			-- most can be updated and changed!
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Publisher not updated.' AS Result;
	END;

	START TRANSACTION;
	UPDATE Publishers                                                                        			-- update most (not name)
	SET phone_number = phone_num_input,
		contact_name = contact_name_input,
		email = email_input
	WHERE publisher_id = publisher_id_selected;
	COMMIT;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_update_order_item;
DELIMITER //
CREATE PROCEDURE sp_update_order_item(																	-- label input and output
	IN order_item_id_selected INT,	
	IN score_title_selected VARCHAR(255),				
	IN quantity_input INT																				-- only score title and quantity can be updated!
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Order Item not updated.' AS Result;
	END;

	START TRANSACTION;
	UPDATE Order_Items                                                                      
	SET score_id = (SELECT score_id FROM Scores WHERE score_title = score_title_selected),         		-- update title and/or quantity
		quantity = quantity_input
	WHERE order_item_id = order_item_id_selected;
	COMMIT;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_update_customer;
DELIMITER //
CREATE PROCEDURE sp_update_customer(																	-- label input and output
	IN customer_id_selected INT,	
	IN phone_num_input VARCHAR(10),
	IN email_input VARCHAR(255)																			-- all can be updated and changed!
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;																						-- rollback if error
		SELECT 'Error! Customer not updated.' AS Result;
	END;

	START TRANSACTION;
	UPDATE Customers                                                                       				-- update any
	SET phone_number = phone_num_input,
		email = email_input
	WHERE customer_id = customer_id_selected;
	COMMIT;

END //
DELIMITER ;

-- ---------------------------------------------- TRIGGERS ---------------------------------------------
DROP TRIGGER IF EXISTS trg_update_sale_amount;
DELIMITER //
-- Trigger for DELETE on Order_Item
CREATE TRIGGER trg_update_sale_amount
BEFORE DELETE ON Order_Items
FOR EACH ROW
BEGIN
	UPDATE Orders
    SET sale_amount = COALESCE(sale_amount, 0) - OLD.line_total
    WHERE order_id = OLD.order_id;
END //


-- ----------------------------------------------- RESET Procedure -------------------------------------------------
DROP PROCEDURE IF EXISTS sp_reset_aria_db;
DELIMITER //
CREATE PROCEDURE sp_reset_aria_db()
BEGIN
	CREATE DATABASE IF NOT EXISTS `aria_db`                        -- create database and use it
	USE `aria_db`

	SET FOREIGN KEY_CHECKS=0;
	SET AUTOCOMMIT = 0;
								
	CREATE OR REPLACE TABLE Nationalities (                        -- reset Nationalities table w/sample data
		nationality_id INT NOT NULL AUTO_INCREMENT,
		nationality VARCHAR(45) NOT NULL,
		PRIMARY KEY (nationality_id)
	);

	INSERT INTO Nationalities (nationality)
	VALUES('Austrian'), ('German'), ('French');
									
	CREATE OR REPLACE TABLE Composers (                          -- reset Composers table w/sample data
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

	CREATE OR REPLACE TABLE Composition_Types (                            -- reset Composition_Types table w/sample data
		composition_type_id INT NOT NULL AUTO_INCREMENT,
		composition_type VARCHAR(45) NOT NULL,
		PRIMARY KEY (composition_type_id)
	);

	INSERT INTO Composition_Types (composition_type)
	VALUES 
	('Symphony'),
	('Unaccompanied'),
	('Concerto'),
	('Oratorio'),
	('Mass'),
	('Chamber Music'),
	('Suite');
											
	CREATE OR REPLACE TABLE Styles (                                      -- reset Styles table w/sample data
		style_id INT NOT NULL AUTO_INCREMENT,
		style VARCHAR(45) NOT NULL,
		PRIMARY KEY (style_id)
	);

	INSERT INTO Styles (style)
	VALUES
	('Folk'),
	('Medieval'),
	('Baroque'),
	('Classical'),
	('Romantic'),
	('Contemporary'),
	('Modern');

	CREATE OR REPLACE TABLE Publishers (                                  -- reset Publishers table w/sample data
		publisher_id INT NOT NULL AUTO_INCREMENT,
		publisher_name VARCHAR(255) NOT NULL,
		phone_number VARCHAR(10) NOT NULL,
		contact_name VARCHAR(45) NOT NULL,
		email VARCHAR(255) NOT NULL,
		PRIMARY KEY (publisher_id)
	);

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

	CREATE OR REPLACE TABLE Scores (                                  -- reset Scores table w/ sample data
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

	CREATE OR REPLACE TABLE Customers (                                    -- reset Customers table w/sample data
		customer_id int NOT NULL AUTO_INCREMENT,
		first_name VARCHAR(45) NOT NULL,
		last_name VARCHAR(45) NOT NULL,
		phone_number VARCHAR(10) NOT NULL,
		email VARCHAR(255) NOT NULL,
		PRIMARY KEY (customer_id)
	);

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

	TRUNCATE TABLE Orders;
	CREATE TABLE IF NOT EXISTS Orders (                                      -- reset Orders table w/sample data
		order_id int NOT NULL AUTO_INCREMENT,
		customer_id INT NOT NULL,
		date DATETIME NOT NULL,
		sale_amount DECIMAL(9,2),
		PRIMARY KEY (order_id),
		CONSTRAINT fk_Orders_Customers 
		FOREIGN KEY (customer_id) REFERENCES Customers (customer_id) ON DELETE NO ACTION
	);

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

	TRUNCATE TABLE Order_Items;
	CREATE TABLE IF NOT EXISTS Order_Items (                                      -- reset Order_Items table w/sample data
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

	-- Update data to the line_total in the 'Order_Items' table
	UPDATE Order_Items
	SET line_total = (quantity * unit_price);

 	-- Update data to the sale_amount in the 'Orders' table
  	UPDATE Orders
  	SET sale_amount = (SELECT SUM(line_total) FROM Order_Items WHERE Order_Items.order_id = Orders.order_id);

  	SET FOREIGN_KEY_CHECKS = 1;
	COMMIT;
  
END //
DELIMITER ;

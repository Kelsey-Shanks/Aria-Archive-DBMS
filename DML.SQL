/*
CS340 Project Step 6
Group 21
Kelsey Shanks 
Haruka Banin
12/05/2025
*/

-- READ operations of CRUD:
-- SELECT for dropdown display ------------------------------------------------------------------------------------------------------------------------------------------------------
SELECT first_name, middle_name, last_name FROM Composers ORDER BY first_name ASC;               -- dropdowns:   composer    (Scores, Composers pages)    (ids registered by onClick)
SELECT publisher_name FROM Publishers ORDER BY publisher_name ASC;                              --              publisher   (Scores, Composers pages) 
SELECT * FROM Composition_Types ORDER BY composition_type ASC;                                  --              type        (Scores pagee)
SELECT * FROM Styles ORDER BY style ASC;                                                        --              style       (Scores page)
SELECT title FROM Scores ORDER BY title ASC;                                                    --              titles      (Scores page)
SELECT * FROM Nationalities ORDER BY nationality ASC;                                           --              nationality (Composers page)
SELECT first_name, last_name FROM Customers ORDER BY first_name ASC;                            --              customer    (Orders, Customers pages)

-- SELECT for each entity table display ----------------------------------------------------------------------------------------------------------------------------------------------
SELECT Scores.score_id, Scores.title, (CONCAT(Composers.first_name, ' ', Composers.middle_name, ' ', Composers.last_name) AS composer_name),   -- populates the main table:  Scores
    Publishers.publisher_name, Composition_Types.composition_type, Styles.style, price 
    FROM Scores
    LEFT JOIN Composers ON Scores.composer_id = Composers.composer_id
    LEFT JOIN Publishers ON Scores.publisher_id = Publishers.publisher_id
    LEFT JOIN Composition_Types ON Scores.composition_type_id = Composition_Types.composition_type_id
    LEFT JOIN Styles ON Scores.style_id = Styles.style_id;

SELECT Composers.composer_id, Composers.first_name, Composers.middle_name, Composers.last_name,                                 -- populates the main table:  Composers
    Composers.birth_date, Composers.death_date, Nationalities.nationality 
    FROM Composers 
    LEFT JOIN Nationalities ON Composers.nationality_id = Nationalities.nationality_id;                                                      

SELECT * FROM Publishers;                                                                                                       -- populates the main table:  Publishers  

SELECT Orders.order_id, Customers.first_name, Customers.last_name, DATE_FORMAT(Orders.date, '%Y-%m-%d %H:%i:%s') AS date, Orders.sale_amount 
    FROM Orders
    LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id;                                                          -- populates the main table:  Orders

SELECT * FROM Customers;                                                                                                        -- populates the main table:  Customers

SELECT * FROM Nationalities;                                                                                                    -- populates the main table:  Nationalities

SELECT * FROM Composition_Types;                                                                                                -- populates the main table:  Composition_Types

SELECT * FROM Styles;                                                                                                           -- populates the main table:  Styles
        
SELECT Order_Items.order_item_id, Order_Items.order_id, Scores.title, Order_Items.quantity, Order_Items.unit_price, Order_Items.line_total  -- populates the main table:  Order_Items
    FROM Order_Items
    LEFT JOIN Scores ON Order_Items.score_id = Scores.score_id;

-- CREATE operations of CRUD:
-- INSERTS for all entities -----------------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO Scores (title, composer_id, publisher_id, composition_type_id, style_id, price)         -- inserts entry into table:  Scores
VALUES (
    :title_input, 
    :c_name_input,                                  
    :p_name_input,                                  
    :c_type_input,                                  
    :style_input,                                  
    :price_input
);

INSERT INTO Composers (first_name, middle_name, last_name, birth_date, death_date, nationality_id)  -- inserts entry into table:  Composers
VALUES (
    :f_name_input,
    :m_name_input,
    :l_name_input,
    :b_day_input,
    :d_day_input,
    :nationality_input                                           
);

INSERT INTO Publishers (publisher_name, phone_number, contact_name, email)                          -- inserts entry into table:  Publishers
VALUES (
    :p_name_input,
    :p_number_input,
    :contact_name_input,
    :email_input              
);

INSERT INTO Orders (customer_id, date, sale_amount)                                                 -- inserts entry into table: Orders
VALUES (
    :customer_input,
    :date_input,
    :sale_input            
);

INSERT INTO Customers (first_name, last_name, phone_number, email)                                  -- inserts entry into table: Customers
VALUES (
    :f_name_input,
    :l_name_input,
    :phone_num_input,
    :email_input
);

INSERT INTO Nationalities (nationality)                                                             -- inserts entry into table: Nationalities
VALUES (
    :nationality_input
);

INSERT INTO Composition_Types (composition_type)                                                    -- inserts entry into table: Composition_Types 
VALUES (
    :c_type_input
);

INSERT INTO Styles (style)                                                                          -- inserts entry into table: Styles
VALUES (
    :style_input
);

INSERT INTO Order_Items (order_id, score_id, quantity, unit_price, line_total)                      -- inserts entry into table: Order_Items
VALUES (
    :order_input,                                                                                               -- from dropdown of customer name, date, price options
    :score_input,                                                                                               -- from dropdown of score titles
    :quantity_input,                                                                                            -- user input
    (SELECT price FROM Scores WHERE score_id = :score_input),
    ((SELECT price FROM Scores WHERE score_id = :score_input) * :quantity_input)                                    
);

-- UPDATE operations for CRUD:
-- UPDATEs for updating and SELECTs for autofilling input boxes -------------------------------------------------------------------------------------------------------------
SELECT score_id, title, price                                                           -- autofills data from table:   Scores 
    FROM Scores                                                                                 -- only price updates!
WHERE score_id = :score_id_selected;

UPDATE Scores
SET title = :title_input, 
    composer_id = :composer_id_selected, 
    publisher_id = :publisher_id_selected, 
    composition_type_id = composition_type_selected, 
    style_id = style_selected, 
    price = :price_input
WHERE score_id = :score_id_selected;

SELECT Composers.composer_id, (CONCAT(Composers.first_name, ' ', Composers.middle_name, ' ', Composers.last_name) AS composer_name), Composers.death_date  -- autofills data from table:    Composers              
    FROM Composers
WHERE composer_id = :composer_id_selected;

UPDATE Composers                                                                        -- updates data using input:    Composers
    SET death_date = :d_day_input,                                                              -- only death date updates!
WHERE composer_id = :composer_id_selected;

SELECT publisher_id, publisher_name, phone_number, contact_name, email                  -- autofills data from table:    Publishers
    FROM Publishers
WHERE publisher_id = :publisher_id_selected;

UPDATE Publisher                                                                        -- updates data using input:    Publishers
SET publisher_name = :publisher_name_input,
    phone_number = :phone_num_input,
    contact_name = :contact_name_input,
    email = :email_input
WHERE publisher_id = :publisher_id_selected;

SELECT Order_Items.order_item_id, Scores.title, Order_Items.quantity_input              -- autofills data from table:  Order_Items
    FROM Order_Items
    LEFT JOIN Scores ON Order_Items.score_id = Scores.score_id;
WHERE order_item_id = :order_item_id_selected

UPDATE Order_Items                                                                      -- updates data using input:    Order_Items
SET score_id = (SELECT score_id FROM Scores WHERE score_title = :score_title_selected),         -- only title and quantity updates!
    quantity = :quantity_input,
WHERE order_item_id = :order_item_id_selected;

SELECT customer_id, first_name, last_name, phone_number, email                         -- autofils data from table:    Customers
FROM Customers
WHERE customer_id = :customer_id_selected;

UPDATE Customers                                                                       -- updates data using input:    Customers
SET phone_number = :phone_num_input,
    email = :email_input
WHERE customer_id = :customer_id_selected;

-- DELETE operation for CRUD:
-- DELETE for deleting an entry- ------------------------------------------------------------------------------------------------------------------------
DELETE FROM Scores WHERE score_id = :score_id_selected;                             -- deletes entry based on id:   Scores

DELETE FROM Orders WHERE order_id = :order_id_selected;                             -- deletes entry based on id:   Orders

DELETE FROM Order_Items WHERE order_item_id = :order_item_id_selected;              -- deletes entry based on id:   Order_Items

DELETE FROM Publishers WHERE publisher_id = :p_id selected;                         -- deletes entry based on id:   Composers

DELETE FROM Composers WHERE composer_id = :comp_id selected;                        -- deletes entry based on id:   Order_Items

DELETE FROM Customers WHERE customer_id = :cust_id selected;                        -- deletes entry based on id:   Customers

DELETE FROM Nationalities WHERE nationality_id = :nationality_id_selected;          -- deletes entry based on id:   Nationalities (has no update, just CREATE & DELETE)

DELETE FROM Composition_Types WHERE composition_type_id = :type_id_selected;        -- deletes entry based on id:   Composition_Types (has no update, just CREATE & DELETE)

DELETE FROM Styles WHERE style_id = :style_id_selected;                             -- deletes entry based on id:   Styles (has no update, just CREATE & DELETE)
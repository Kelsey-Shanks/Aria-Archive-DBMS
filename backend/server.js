// ########################################
// ########## SETUP

// Database
const db = require('./database/db-connector');

// Express
const express = require('express');
const app = express();

// Middleware
const cors = require('cors');
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests

const PORT = 9953;

// ########################################
// ########## ROUTE HANDLERS

// Citation for the following code: 
// Date: 11/18/2025
// All server side code is based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used code on canvas as a template and modified details to match use case.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149


app.get('/composers', async (req, res) => {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT Composers.composer_id, Composers.first_name, Composers.middle_name, Composers.last_name, \
        Composers.birth_date, Composers.death_date, Nationalities.nationality FROM Composers \
            LEFT JOIN Nationalities ON Composers.nationality_id = Nationalities.nationality_id;`;
        const query2 = 'SELECT * FROM Nationalities ORDER BY nationality ASC';
        const [composers] = await db.query(query1);
        const [nationalities] = await db.query(query2);

        const formattedComposers = composers.map(row => ({
            ...row,
            birth_date: row.birth_date ? row.birth_date.toISOString().split('T')[0] : null,
            death_date: row.death_date ? row.death_date.toISOString().split('T')[0] : null
          }));
    
        res.status(200).json({ composers: formattedComposers, nationalities });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }   
});

app.get('/customers', async (req, res) => {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT * FROM Customers;`;
        const [customers] = await db.query(query1);
    
        res.status(200).json({ customers });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }   
});

app.get('/nationalities', async (req, res) => {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT * FROM Nationalities;`;
        const [nationalities] = await db.query(query1);
    
        res.status(200).json({ nationalities });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }   
});

app.get('/publishers', async (req, res) => {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT * FROM Publishers;`;
        const [publishers] = await db.query(query1);
    
        res.status(200).json({ publishers });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }   
});

app.get('/scores', async (req, res) => {
    try {
        // Get sorting parameters from query string
        const sortBy = req.query.sortBy || 'score_id';       // default sort column
        const sortOrder = req.query.sortOrder || 'ASC';  // default order

        // Allow only certain columns to prevent SQL injection
        const allowedSortColumns = ['score_id', 'title', 'composer_name', 'publisher_name', 'composition_type', 'style'];
        const allowedSortOrder = ['ASC', 'DESC'];

        const column = allowedSortColumns.includes(sortBy) ? sortBy : 'score_id';
        const order = allowedSortOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

        // Query with dynamic ORDER BY
        const query1 = `
            SELECT Scores.score_id, Scores.title, 
                   CONCAT(Composers.first_name, ' ', Composers.middle_name, ' ', Composers.last_name) AS composer_name,
                   Publishers.publisher_name, Composition_Types.composition_type, Styles.style, Scores.price
            FROM Scores
            LEFT JOIN Composers ON Scores.composer_id = Composers.composer_id
            LEFT JOIN Publishers ON Scores.publisher_id = Publishers.publisher_id
            LEFT JOIN Composition_Types ON Scores.composition_type_id = Composition_Types.composition_type_id
            LEFT JOIN Styles ON Scores.style_id = Styles.style_id
            ORDER BY ${column} ${order};
        `;

        const [scores] = await db.query(query1);

        // Other dropdown data (composers, publishers, etc.) remain the same
        const [composers] = await db.query('SELECT composer_id, first_name, middle_name, last_name FROM Composers ORDER BY first_name ASC;');
        const [publishers] = await db.query('SELECT publisher_id, publisher_name FROM Publishers ORDER BY publisher_name ASC;');
        const [composition_types] = await db.query('SELECT * FROM Composition_Types ORDER BY composition_type ASC;');
        const [styles] = await db.query('SELECT * FROM Styles ORDER BY style ASC;');

        res.status(200).json({ scores, composers, publishers, composition_types, styles });

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/orders', async (req, res) => {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT Orders.order_id, Customers.first_name, Customers.last_name, DATE_FORMAT(Orders.date, '%Y-%m-%d %H:%i:%s') AS date, Orders.sale_amount FROM Orders\
            LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id;`;
        const query2 = 'SELECT customer_id, first_name, last_name FROM Customers ORDER BY first_name ASC;';
        const [orders] = await db.query(query1);
        const [customers] = await db.query(query2);

        res.status(200).json({ orders, customers });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }   
});

app.get('/composition_types', async (req, res) => {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT * FROM Composition_Types;`;
        const [composition_types] = await db.query(query1);
    
        res.status(200).json({ composition_types });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }   
});

app.get('/styles', async (req, res) => {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT * FROM Styles;`;
        const [styles] = await db.query(query1);
    
        res.status(200).json({ styles });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }   
});

app.get('/order_items', async (req, res) => {
    console.error("order_items get handler");

    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT Order_Items.order_item_id, Order_Items.order_id, Scores.title, Order_Items.quantity, Order_Items.unit_price, Order_Items.line_total FROM Order_Items\
            LEFT JOIN Scores ON Order_Items.score_id = Scores.score_id;`;
        const query2 = 'SELECT score_id, title FROM Scores ORDER BY title ASC;';
        const query3 = 'SELECT order_id FROM Orders ORDER BY order_id ASC'
        const [order_items] = await db.query(query1);
        const [scores] = await db.query(query2);
        const [orders] = await db.query(query3);

        res.status(200).json({ order_items, scores, orders });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }   
});

// ########################################
// ########## Create
app.post('/composers/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        const ddate = data.create_composer_ddate || null;
        const nationalityIdInt = parseInt(data.create_composer_nationality, 10);

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_create_composer(?, ?, ?, ?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        await db.query(query1, [
            data.create_composer_fname,
            data.create_composer_mname,
            data.create_composer_lname,
            data.create_composer_bdate,
            ddate,
            nationalityIdInt,
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE Composers. ID: ${rows.new_id} ` +
            `Name: ${data.create_composer_fname} ${data.create_composer_mname} ${data.create_composer_lname}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Composer created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


app.post('/composition_types/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_create_composition_type(?, @new_id);`;

        // Store ID of last inserted row
        await db.query(query1, [
            data.create_composition_type,
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE Composition_Types. ID: ${rows.new_id} ` +
            `Name: ${data.create_composition_type}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Composition Type created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/nationalities/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_create_nationality(?, @new_id);`;

        // Store ID of last inserted row
        await db.query(query1, [
            data.create_nationality_nationality,
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE Nationalities. ID: ${rows.new_id} ` +
            `Name: ${data.create_nationality_nationality}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Nationality created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/styles/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_create_style(?, @new_id);`;

        // Store ID of last inserted row
        await db.query(query1, [
            data.create_style_style,
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE Styles. ID: ${rows.new_id} ` +
            `Name: ${data.create_style_style}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Style created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/customers/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_create_customer(?, ?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        await db.query(query1, [
            data.create_customer_fname,
            data.create_customer_lname,
            data.create_customer_phone,
            data.create_customer_email,
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE Customers. ID: ${rows.new_id} ` +
            `Name: ${data.create_customer_fname} ${data.create_customer_lname}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Customer created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/publishers/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_create_publisher(?, ?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        await db.query(query1, [
            data.create_publisher_name,
            data.create_publisher_phone,
            data.create_publisher_cname,
            data.create_publisher_email,
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE Publishers. ID: ${rows.new_id} ` +
            `Name: ${data.create_publisher_name}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Publisher created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/orders/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        const customerIdInt = parseInt(data.create_order_customer_name, 10);

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_create_order(?, @new_id);`;

        // Store ID of last inserted row
        await db.query(query1, [
            customerIdInt,
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE Orders. ID: ${rows.new_id} ` +
            `Name: ${data.create_order_customer_name}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/order_items/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        const orderIdInt = parseInt(data.create_order_item_order, 10);
        const scoreIdInt = parseInt(data.create_order_item_score, 10);

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_create_order_item(?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        await db.query(query1, [
            orderIdInt,
            scoreIdInt,
            data.create_order_item_quantity,
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE Order_Items. ID: ${rows.new_id} ` +
            `Name: ${data.create_order_item_order}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Order Item created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/scores/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;
        
        // Cast string to int
        const composerIdInt = parseInt(data.create_score_composer, 10);
        const publisherIdInt = parseInt(data.create_score_publisher, 10);
        const compositionTypeIdInt = parseInt(data.create_score_composition_types, 10);
        const styleIdInt = parseInt(data.create_score_style, 10);

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_create_score(?, ?, ?, ?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        await db.query(query1, [
            data.create_score_title,
            composerIdInt,
            publisherIdInt,
            compositionTypeIdInt,
            styleIdInt,
            data.create_score_price,
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE Scores. ID: ${rows.new_id} ` +
            `Name: ${data.create_score_title}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Score created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


// ########################################
// ########## Update
app.post('/composers/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_update_composer(?, ?);';
        const query2 = 'SELECT first_name, middle_name, last_name FROM Composers WHERE composer_id = ?;';
        await db.query(query1, [
            data.update_composer_id,
            data.update_composer_ddate,
        ]);
        const [[rows]] = await db.query(query2, [data.update_composer_id]);

        console.log(`UPDATE Composers. ID: ${data.update_composer_id} ` +
            `Name: ${rows.first_name} ${rows.middle_name} ${rows.last_name}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Composer updated successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/customers/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_update_customer(?, ?, ?);';
        const query2 = 'SELECT first_name, last_name FROM Customers WHERE customer_id = ?;';
        await db.query(query1, [
            data.update_customer_id,
            data.update_customer_phone,
            data.update_customer_email
        ]);
        const [[rows]] = await db.query(query2, [data.update_customer_id]);

        console.log(`UPDATE Customers. ID: ${data.update_customer_id} ` +
            `Name: ${rows.first_name} ${rows.last_name}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/publishers/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_update_publisher(?, ?, ?, ?);';
        const query2 = 'SELECT publisher_name FROM Publishers WHERE publisher_id = ?;';
        await db.query(query1, [
            data.update_publisher_id,
            data.update_publisher_phone,
            data.update_publisher_cname,
            data.update_publisher_email
        ]);
        const [[rows]] = await db.query(query2, [data.update_publisher_id]);

        console.log(`UPDATE Publishers. ID: ${data.update_publisher_id} ` +
            `Name: ${rows.publisher_name}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Publisher updated successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/scores/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_update_score(?, ?);';
        const query2 = 'SELECT title FROM Scores WHERE score_id = ?;';
        await db.query(query1, [
            data.update_score_id,
            data.update_score_price
        ]);
        const [[rows]] = await db.query(query2, [data.update_score_id]);

        console.log(`UPDATE Scores. ID: ${data.update_score_id} ` +
            `Name: ${rows.title}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Score updated successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/order_items/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;
        
        // cast string to int
        const scoreInt = parseInt(data.update_order_item_score, 10);
        const quantityInt = parseInt(data.update_order_item_quantity, 10);

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_update_order_item(?, ?, ?);';
        const query2 = 'SELECT order_id, score_id FROM Order_Items WHERE order_item_id = ?;';
        await db.query(query1, [
            data.update_order_item_id,
            scoreInt,
            quantityInt,
        ]);

        const [[rows]] = await db.query(query2, [data.update_order_item_id]);

        console.log(`UPDATE Order_Items. ID: ${data.update_order_item_id} ` +
            `Order ID: ${rows.order_id}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Order Item updated successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// Citation for the following code:
// Date: 11/18/2025
// Adapted from example code that AI gave me
// Degree of originality: Used generated code as an example.
// Source URL: https://gemini.google.com/
// If AI tools were used: Gemini
// How to handle if PL/SQL returns foreign key constraints error

// ########################################
// ########## Delete

// Delete for Scores
app.delete('/scores/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_score_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }

        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['Scores', 'score_id', data.delete_score_id]);

        console.log(`Deleted Score ID: ${data.delete_score_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /scores/delete:", error);

        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active Order Item." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Delete for Styles
app.delete('/styles/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_style_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }
        
        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['Styles', 'style_id', data.delete_style_id]);

        console.log(`Deleted Style ID: ${data.delete_style_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /styles/delete:", error);
        
        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active Score." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Delete for Composers
app.delete('/composers/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_composer_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }
        
        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['Composers', 'composer_id', data.delete_composer_id]);

        console.log(`Deleted Composer ID: ${data.delete_composer_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /composers/delete:", error);
        
        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active Score." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Delete for Publishers
app.delete('/publishers/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_publisher_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }
        
        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['Publishers', 'publisher_id', data.delete_publisher_id]);

        console.log(`Deleted Publisher ID: ${data.delete_publisher_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /publishers/delete:", error);
        
        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active Score." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Delete for Composition Types
app.delete('/composition_types/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_composition_type_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }
        
        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['Composition_Types', 'composition_type_id', data.delete_composition_type_id]);

        console.log(`Deleted Composition Types ID: ${data.delete_composition_type_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /composition_types/delete:", error);
        
        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active Score." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Delete for Nationalities
app.delete('/nationalities/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_nationality_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }
        
        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['Nationalities', 'nationality_id', data.delete_nationality_id]);

        console.log(`Deleted Nationality ID: ${data.delete_nationality_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /nationalities/delete:", error);
        
        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active Composer." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Delete for Orders
app.delete('/orders/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_order_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }
        
        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['Orders', 'order_id', data.delete_order_id]);

        console.log(`Deleted Order ID: ${data.delete_order_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /orders/delete:", error);
        
        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active Order Item." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Delete for Order Items
app.delete('/order_items/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_order_item_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }
        
        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['Order_Items', 'order_item_id', data.delete_order_item_id]);

        console.log(`Deleted Order Item ID: ${data.delete_order_item_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /order_items/delete:", error);
        
        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active Order." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Delete for Customers
app.delete('/customers/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_customer_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }
        
        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['Customers', 'customer_id', data.delete_customer_id]);

        console.log(`Deleted Customer ID: ${data.delete_customer_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /customers/delete:", error);
        
        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active Order." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ########################################
// ########## Reset 
app.post('/reset', async function (req, res) {
    try {
        const query = `CALL sp_reset_aria_db();`; 
        
        await db.query(query);

        console.log("Database Reset Completed.");
        res.json({ success: true });

    } catch (error) {
        console.error("Reset Failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});

// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    create_order_customer_name: ''
};

const CreateOrderForm = ({ customers, backendURL, refreshOrders }) => {

    const [formData, setFormData] = useState(INITIAL_FORM_STATE);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await fetch(backendURL + '/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Order created successfully.");
                refreshOrders();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error creating order.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Create a Order</h2>

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_order_customer_name">Customer Name: </label>
            <select
                name="create_order_customer_name"
                id="create_order_customer_name"
                value={formData.create_order_customer_name}
                onChange={handleChange}
            >
                <option value="">Select a Customer Name</option>
                {customers.map((customer, index) => (
                    <option value={customer.customer_id} key={index}>{customer.first_name} {customer.last_name}</option>
                ))}
            </select>

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateOrderForm;
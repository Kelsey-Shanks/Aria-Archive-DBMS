// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    create_order_item_order: '',
    create_order_item_score: '',
    create_order_item_quantity: ''
};

const CreateOrderItemForm = ({ scores, orders, backendURL, refreshOrderItems }) => {

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
            const response = await fetch(backendURL + '/order_items/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Order item created successfully.");
                refreshOrderItems();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error creating order item.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Create an Order Item</h2>

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_order_item_order">Order ID: </label>
            <select
                name="create_order_item_order"
                id="create_order_item_order"
                value={formData.create_order_item_order}
                onChange={handleChange}
            >
                <option value="">Select an Order ID</option>
                {orders.map((order, index) => (
                    <option value={order.order_id} key={index}>{order.order_id}</option>
                ))}
            </select>

            <label htmlFor="create_order_item_score">Score: </label>
            <select
                name="create_order_item_score"
                id="create_order_item_score"
                value={formData.create_order_item_score}
                onChange={handleChange}
            >
                <option value="">Select a Score</option>
                {scores.map((score, index) => (
                    <option value={score.score_id} key={index}>{score.title}</option>
                ))}
            </select>

            <label htmlFor="create_order_item_quantity">Quantity: </label>
            <input
                type="number"
                name="create_order_item_quantity"
                id="create_order_item_quantity"
                value={formData.create_order_item_quantity}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateOrderItemForm;
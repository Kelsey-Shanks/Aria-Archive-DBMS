// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    update_order_item_id: '',
    update_order_item_score: '',
    update_order_item_quantity: ''
};

const UpdateOrderItemForm = ({ order_items, scores, backendURL, refreshOrderItems }) => {
    
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle the update logic here

        try {
            const response = await fetch(backendURL + '/order_items/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Order Item updated successfully.");
                refreshOrderItems();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error updating order item.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Update an Order Item</h2>
        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="update_order_item_id">Order Item to Update: </label>
            <select
                name="update_order_item_id"
                id="update_order_item_id"
                value={formData.update_order_item_id}
                onChange={handleChange}
            >
                <option value="">Select an Order Item ID</option>
                {order_items.map((order_item) => (
                    <option key={order_item.order_item_id} value={order_item.order_item_id}>
                        {order_item.order_item_id} - {order_item.order_id} - {order_item.title}
                    </option>
                ))}
            </select>

            <label htmlFor="update_order_item_score">Score: </label>
            <select
                type="number"
                name="update_order_item_score"
                id="update_order_item_score"
                value={formData.update_order_item_score}
                onChange={handleChange}
            >
                <option value="">Select a Score</option>
                {scores.map((score, index) => (
                    <option value={score.score_id} key={index}>{score.title}</option>
                ))}
            </select>

            <label htmlFor="update_order_item_quantity">Quantity: </label>
            <input
                type="number"
                name="update_order_item_quantity"
                id="update_order_item_quantity"
                value={formData.update_order_item_quantity}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateOrderItemForm;
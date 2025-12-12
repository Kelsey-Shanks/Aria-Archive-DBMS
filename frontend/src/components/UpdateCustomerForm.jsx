// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    update_customer_id: '',
    update_customer_phone: '',
    update_customer_email: ''
};

const UpdateCustomerForm = ({ customers, backendURL, refreshCustomers }) => {

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
            const response = await fetch(backendURL + '/customers/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Customer updated successfully.");
                refreshCustomers();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error updating customer.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Update a Customer</h2>
        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="update_customer_id">Customer to Update: </label>
            <select
                name="update_customer_id"
                id="update_customer_id"
                value={formData.update_customer_id}
                onChange={handleChange}
            >
                <option value="">Select a Customer</option>
                {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                        {customer.customer_id} - {customer.first_name} {customer.last_name}
                    </option>
                ))}
            </select>

            <label htmlFor="update_customer_phone">Phone: </label>
            <input
                type="text"
                name="update_customer_phone"
                id="update_customer_phone"
                value={formData.update_customer_phone}
                onChange={handleChange}
            />

            <label htmlFor="update_customer_email">Email: </label>
            <input
                type="text"
                name="update_customer_email"
                id="update_customer_email"
                value={formData.update_customer_email}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateCustomerForm;
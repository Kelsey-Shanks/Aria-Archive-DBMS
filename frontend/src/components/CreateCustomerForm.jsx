// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    create_customer_fname: '',
    create_customer_lname: '',
    create_customer_phone: '',
    create_customer_email: ''
};

const CreateCustomerForm = ({ backendURL, refreshCustomers }) => {

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
            const response = await fetch(backendURL + '/customers/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Customer created successfully.");
                refreshCustomers();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error creating customer.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Create a Customer</h2>

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_customer_fname">First Name: </label>
            <input
                type="text"
                name="create_customer_fname"
                id="create_customer_fname"
                value={formData.create_customer_fname}
                onChange={handleChange}
            />

            <label htmlFor="create_customer_lname">Last Name: </label>
            <input
                type="text"
                name="create_customer_lname"
                id="create_customer_lname"
                value={formData.create_customer_lname}
                onChange={handleChange}
            />

            <label htmlFor="create_customer_phone">Phone: </label>
            <input
                type="text"
                name="create_customer_phone"
                id="create_customer_phone"
                value={formData.create_customer_phone}
                onChange={handleChange}
            />
           
            <label htmlFor="create_customer_email">Email: </label>
            <input
                type="text"
                name="create_customer_email"
                id="create_customer_email"
                value={formData.create_customer_email}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateCustomerForm;
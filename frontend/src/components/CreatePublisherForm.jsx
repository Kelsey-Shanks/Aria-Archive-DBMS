// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    create_publisher_name: '',
    create_publisher_phone: '',
    create_publisher_cname: '',
    create_publisher_email: ''
};

const CreatePublisherForm = ({ backendURL, refreshPublishers }) => {

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
            const response = await fetch(backendURL + '/publishers/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Publisher created successfully.");
                refreshPublishers();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error creating publisher.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Create a Publishers</h2>

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_publisher_name">Publisher Name: </label>
            <input
                type="text"
                name="create_publisher_name"
                id="create_publisher_name"
                value={formData.create_publisher_name}
                onChange={handleChange}
            />

            <label htmlFor="create_publisher_phone">Phone: </label>
            <input
                type="text"
                name="create_publisher_phone"
                id="create_publisher_phone"
                value={formData.create_publisher_phone}
                onChange={handleChange}
            />

            <label htmlFor="create_publisher_cname">Contact Name: </label>
            <input
                type="text"
                name="create_publisher_cname"
                id="create_publisher_cname"
                value={formData.create_publisher_cname}
                onChange={handleChange}
            />
           
            <label htmlFor="create_publisher_email">Email: </label>
            <input
                type="text"
                name="create_publisher_email"
                id="create_publisher_email"
                value={formData.create_publisher_email}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default CreatePublisherForm;
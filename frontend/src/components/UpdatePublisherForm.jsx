// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    update_publisher_id: '',
    update_publisher_phone: '',
    update_publisher_cname: '',
    update_publisher_email: ''
};

const UpdatePublisherForm = ({ publishers, backendURL, refreshPublishers }) => {

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
            const response = await fetch(backendURL + '/publishers/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Publisher updated successfully.");
                refreshPublishers();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error updating publisher.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Update a Publisher</h2>
        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="update_publisher_id">Publisher to Update: </label>
            <select
                name="update_publisher_id"
                id="update_publisher_id"
                value={formData.update_publisher_id}
                onChange={handleChange}
            >
                <option value="">Select a Publisher</option>
                {publishers.map((publisher) => (
                    <option key={publisher.id} value={publisher.id}>
                        {publisher.publisher_id} - {publisher.publisher_name} 
                    </option>
                ))}
            </select>

            <label htmlFor="update_publisher_phone">Phone: </label>
            <input
                type="text"
                name="update_publisher_phone"
                id="update_publisher_phone"
                value={formData.update_publisher_phone}
                onChange={handleChange}
            />

            <label htmlFor="update_publisher_cname">Cantact Name: </label>
            <input
                type="text"
                name="update_publisher_cname"
                id="update_publisher_cname"
                value={formData.update_publisher_cname}
                onChange={handleChange}
            />

            <label htmlFor="update_publisher_email">Email: </label>
            <input
                type="text"
                name="update_publisher_email"
                id="update_publisher_email"
                value={formData.update_publisher_email}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdatePublisherForm;
// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    create_style_style: ''
};

const CreateStyleForm = ({ backendURL, refreshStyles }) => {
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
            const response = await fetch(backendURL + '/styles/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Style created successfully.");
                refreshStyles();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error creating style.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Create a Style</h2>

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_style_style">Style: </label>
            <input
                type="text"
                name="create_style_style"
                id="create_style_style"
                value={formData.create_style_style}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateStyleForm;
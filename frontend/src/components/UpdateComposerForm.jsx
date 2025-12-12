// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    update_composer_id: '',
    update_composer_ddate: ''
};

const UpdateComposerForm = ({ composers, backendURL, refreshComposers }) => {
    
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
            const response = await fetch(backendURL + '/composers/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Composer updated successfully.");
                refreshComposers();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error updating composer.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Update a Composer</h2>
        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="update_composer_id">Composer to Update: </label>
            <select
                name="update_composer_id"
                id="update_composer_id"
                value={formData.update_composer_id}
                onChange={handleChange}
            >
                <option value="">Select a Composer</option>
                {composers.map((composer) => (
                    <option key={composer.id} value={composer.id}>
                        {composer.composer_id} - {composer.first_name} {composer.middle_name} {composer.last_name}
                    </option>
                ))}
            </select>

            <label htmlFor="update_composer_ddate">Death Date: </label>
            <input
                type="date"
                name="update_composer_ddate"
                id="update_composer_ddate"
                value={formData.update_composer_ddate}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateComposerForm;
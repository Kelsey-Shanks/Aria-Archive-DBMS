// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    update_score_id: '',
    update_score_price: ''
};

const UpdateScoreForm = ({ scores, backendURL, refreshScores }) => {

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
            const response = await fetch(backendURL + '/scores/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Score updated successfully.");
                refreshScores();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error updating score.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Update a Score</h2>
        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="update_score_id">Score to Update: </label>
            <select
                name="update_score_id"
                id="update_score_id"
                value={formData.update_score_id}
                onChange={handleChange}
            >
                <option value="">Select a Score</option>
                {scores.map((score) => (
                    <option key={score.id} value={score.id}>
                        {score.score_id} - {score.title}
                    </option>
                ))}
            </select>

            <label htmlFor="update_score_price">Price: </label>
            <input
                type="decimal"
                name="update_score_price"
                id="update_score_price"
                value={formData.update_score_price}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateScoreForm;
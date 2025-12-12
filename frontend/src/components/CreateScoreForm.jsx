// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    create_score_title: '',
    create_score_composer: '',
    create_score_publisher: '',
    create_score_composition_types: '',
    create_score_style: '',
    create_score_price: ''
};

const CreateScoreForm = ({ composers, publishers, composition_types, styles, backendURL, refreshScores }) => {

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
            const response = await fetch(backendURL + '/scores/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Score created successfully.");
                refreshScores();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error creating score.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Create a Score</h2>

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_score_title">Title: </label>
            <input
                type="text"
                name="create_score_title"
                id="create_score_title"
                value={formData.create_score_title}
                onChange={handleChange}
            />

            <label htmlFor="create_score_composer">Composer: </label>
            <select
                name="create_score_composer"
                id="create_score_composer"
                value={formData.create_score_composer}
                onChange={handleChange}
            >
                <option value="">Select a Composer</option>
                {composers.map((composer, index) => (
                    <option value={composer.composer_id} key={index}>{composer.first_name} {composer.middle_name} {composer.last_name}</option>
                ))}
            </select>

            <label htmlFor="create_score_publisher">Publisher: </label>
            <select
                name="create_score_publisher"
                id="create_score_publisher"
                value={formData.create_score_publisher}
                onChange={handleChange}
            >
                <option value="">Select a Publisher</option>
                {publishers.map((publisher, index) => (
                    <option value={publisher.publisher_id} key={index}>{publisher.publisher_name}</option>
                ))}
            </select>

            <label htmlFor="create_score_composition_types">Composition Type: </label>
            <select
                name="create_score_composition_types"
                id="create_score_composition_types"
                value={formData.create_score_composition_types}
                onChange={handleChange}
            >
                <option value="">Select a Composition Type</option>
                {composition_types.map((composition_type, index) => (
                    <option value={composition_type.composition_type_id} key={index}>{composition_type.composition_type}</option>
                ))}
            </select>


            <label htmlFor="create_score_style">Styles: </label>
            <select
                name="create_score_style"
                id="create_score_style"
                value={formData.create_score_style}
                onChange={handleChange}
            >
                <option value="">Select a Style</option>
                {styles.map((style, index) => (
                    <option value={style.style_id} key={index}>{style.style}</option>
                ))}
            </select>

            <label htmlFor="create_score_price">Price: </label>
            <input
                type="decimal"
                name="create_score_price"
                id="create_score_price"
                value={formData.create_score_price}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateScoreForm;
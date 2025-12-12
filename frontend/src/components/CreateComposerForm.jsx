// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology' and 'Exploration - Implementing CUD operations in your app'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
    create_composer_fname: '',
    create_composer_mname: '',
    create_composer_lname: '',
    create_composer_bdate: '',
    create_composer_ddate: '',
    create_composer_nationality: ''
};

const CreateComposerForm = ({ nationalities, backendURL, refreshComposers }) => {

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
            const response = await fetch(backendURL + '/composers/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Composer created successfully.");
                refreshComposers();
                setFormData(INITIAL_FORM_STATE);
            } else {
                alert("Error creating composer.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Create a Composer</h2>

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_composer_fname">First Name: </label>
            <input
                type="text"
                name="create_composer_fname"
                id="create_composer_fname"
                value={formData.create_composer_fname}
                onChange={handleChange}
            />

            <label htmlFor="create_composer_mname">Middle Name: </label>
            <input
                type="text"
                name="create_composer_mname"
                id="create_composer_mname"
                value={formData.create_composer_mname}
                onChange={handleChange}
            />

            <label htmlFor="create_composer_lname">Last Name: </label>
            <input
                type="text"
                name="create_composer_lname"
                id="create_composer_lname"
                value={formData.create_composer_lname}
                onChange={handleChange}
            />

            <label htmlFor="create_composer_bdate">Birth Date: </label>
            <input
                type="date"
                name="create_composer_bdate"
                id="create_composer_bdate"
                value={formData.create_composer_bdate}
                onChange={handleChange}
            />

            <label htmlFor="create_composer_ddate">Death Date: </label>
            <input
                type="date"
                name="create_composer_ddate"
                id="create_composer_ddate"
                value={formData.create_composer_ddate}
                onChange={handleChange}
            />

            <label htmlFor="create_composer_nationality">Nationality: </label>
            <select
                name="create_composer_nationality"
                id="create_composer_nationality"
                value={formData.create_composer_nationality}
                onChange={handleChange}
            >
                <option value="">Select a Nationality</option>
                {nationalities.map((nationality, index) => (
                    <option value={nationality.nationality_id} key={index}>{nationality.nationality}</option>
                ))}
            </select>

            <input type="submit" />
        </form>
        </>
    );
};
export default CreateComposerForm;
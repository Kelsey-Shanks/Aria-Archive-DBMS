// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';
import CreateComposerForm from '../components/CreateComposerForm';
import UpdateComposerForm from '../components/UpdateComposerForm';


function Composers({ backendURL }) {

    // Set up a state variable `people` to store and display the backend response
    const [composers, setComposers] = useState([]);
    const [nationalities, setNationalities] = useState([]);

    const columnMap = {
        composer_id: "Composer ID",
        first_name: "First Name",
        middle_name: "Middle Name",
        last_name: "Last Name",
        birth_date: "Birth Date",
        death_date: "Death Date",
        nationality: "Nationality"
      };

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/composers');
            
            // Convert the response into JSON format
            const {composers, nationalities} = await response.json();
    
            // Update the people state with the response data
            setComposers(composers);
            setNationalities(nationalities);
            
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(error);
        }

    };

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Composers</h1>

            <table>
                <thead>
                    <tr>
                    {composers.length > 0 &&
                        Object.keys(composers[0]).map((key, index) => (
                        <th key={index}>{columnMap[key] || key}</th>
                        ))
                    }
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {composers.map((composer, index) => (
                    <TableRow key={index} rowObject={composer} backendURL={backendURL} refresh={getData} deleteEndpoint="/composers/delete" deleteIdKey="delete_composer_id" idColumnName="composer_id"/>
                    ))}
                </tbody>
            </table>
            
            <CreateComposerForm nationalities={nationalities} backendURL={backendURL} refreshComposers={getData} />
            <UpdateComposerForm composers={composers} backendURL={backendURL} refreshComposers={getData} />               
        </>
    );

} export default Composers;
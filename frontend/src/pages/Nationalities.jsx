// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateNationalityForm from '../components/CreateNationalityForm';

function Nationalities({ backendURL }) {

    const [nationalities, setNationalities] = useState([]);
    
    const columnMap = {
        nationality_id: "Nationality ID",
        nationality: "Nationality"
      };
      
    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/nationalities');
            
            // Convert the response into JSON format
            const {nationalities} = await response.json();
    
            // Update the people state with the response data
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
            <h1>Nationalities</h1>

            <table>
                <thead>
                        <tr>
                        {nationalities.length > 0 &&
                            Object.keys(nationalities[0]).map((key, index) => (
                            <th key={index}>{columnMap[key] || key}</th>
                            ))
                        }
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {nationalities.map((nationality, index) => (
                        <TableRow key={index} rowObject={nationality} backendURL={backendURL} refresh={getData} deleteEndpoint="/nationalities/delete" deleteIdKey="delete_nationality_id" idColumnName="nationality_id"/>
                    ))}

                </tbody>
            </table>
            
            <CreateNationalityForm backendURL={backendURL} refreshNationalities={getData} />
        </>
    );

} export default Nationalities;
// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateCompositionTypeForm from '../components/CreateCompositionTypeForm';

function Composition_Types({ backendURL }) {

    const [composition_types, setCompositionTypes] = useState([]);

    const columnMap = {
        composition_type_id: "Composition Type ID",
        composition_type: "Composition Type"
      };
    
    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/composition_types');
            
            // Convert the response into JSON format
            const {composition_types} = await response.json();
    
            // Update the people state with the response data
            setCompositionTypes(composition_types);
            
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
            <h1>Composition Types</h1>

            <table>
                <thead>
                    <tr>
                        {composition_types.length > 0 &&
                            Object.keys(composition_types[0]).map((key, index) => (
                            <th key={index}>{columnMap[key] || key}</th>
                            ))
                        }
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {composition_types.map((composition_type, index) => (
                        <TableRow key={index} rowObject={composition_type} backendURL={backendURL} refresh={getData} deleteEndpoint="/composition_types/delete" deleteIdKey="delete_composition_type_id" idColumnName="composition_type_id"/>
                    ))}

                </tbody>
            </table>
            
            <CreateCompositionTypeForm backendURL={backendURL} refreshCompositionTypes={getData} />
        </>
    );

} export default Composition_Types;
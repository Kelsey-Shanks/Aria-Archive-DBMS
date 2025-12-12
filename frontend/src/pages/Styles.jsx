// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateStyleForm from '../components/CreateStyleForm';

function Styles({ backendURL }) {

    const [styles, setStyles] = useState([]);

    const columnMap = {
        style_id: "Style ID",
        style: "Style"
      };
    
    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/styles');
            
            // Convert the response into JSON format
            const {styles} = await response.json();
    
            // Update the people state with the response data
            setStyles(styles);
            
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
            <h1>Styles</h1>

            <table>
                <thead>
                    <tr>
                        {styles.length > 0 &&
                            Object.keys(styles[0]).map((key, index) => (
                            <th key={index}>{columnMap[key] || key}</th>
                            ))
                        }
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {styles.map((style, index) => (
                        <TableRow key={index} rowObject={style} backendURL={backendURL} refresh={getData} deleteEndpoint="/styles/delete" deleteIdKey="delete_style_id" idColumnName="style_id"/>
                    ))}
                </tbody>
            </table>
            
            <CreateStyleForm backendURL={backendURL} refreshStyles={getData} />
        </>
    );

} export default Styles;
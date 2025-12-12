// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreatePublisherForm from '../components/CreatePublisherForm';
import UpdatePublisherForm from '../components/UpdatePublisherForm';


function Publishers({ backendURL }) {

    const [publishers, setPublishers] = useState([]);

    const columnMap = {
        publisher_id: "Publisher ID",
        publisher_name: "Publisher",
        phone_number: "Phone",
        contact_name: "Contact Name",
        email: "Email"
      };
    
        const getData = async function () {
            try {
                // Make a GET request to the backend
                const response = await fetch(backendURL + '/publishers');
                
                // Convert the response into JSON format
                const {publishers} = await response.json();
        
                // Update the people state with the response data
                setPublishers(publishers);
                
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
                <h1>Publishers</h1>
    
                <table>
                    <thead>
                        <tr>
                            {publishers.length > 0 &&
                                Object.keys(publishers[0]).map((key, index) => (
                                <th key={index}>{columnMap[key] || key}</th>
                                ))
                            }
                            <th></th>
                        </tr>
                    </thead>
    
                    <tbody>
                        {publishers.map((publisher, index) => (
                            <TableRow key={index} rowObject={publisher} backendURL={backendURL} refresh={getData} deleteEndpoint="/publishers/delete" deleteIdKey="delete_publisher_id" idColumnName="publisher_id"/>
                        ))}
    
                    </tbody>
                </table>
                
                <CreatePublisherForm backendURL={backendURL} refreshPublishers={getData} />
                <UpdatePublisherForm publishers={publishers} backendURL={backendURL} refreshPublishers={getData} />               
            </>
        );

} export default Publishers;
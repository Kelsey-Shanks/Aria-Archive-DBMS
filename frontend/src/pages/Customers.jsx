// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateCustomerForm from '../components/CreateCustomerForm';
import UpdateCustomerForm from '../components/UpdateCustomerForm';


function Customers({ backendURL }) {

        // Set up a state variable `people` to store and display the backend response
        const [customers, setCustomers] = useState([]);

        const columnMap = {
            customer_id: "Customer ID",
            first_name: "First Name",
            last_name: "Last Name",
            phone_number: "Phone",
            email: "Email"
          };
    
        const getData = async function () {
            try {
                // Make a GET request to the backend
                const response = await fetch(backendURL + '/customers');
                
                // Convert the response into JSON format
                const {customers} = await response.json();
        
                // Update the people state with the response data
                setCustomers(customers);
                
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
                <h1>Customers</h1>
    
                <table>
                    <thead>
                        <tr>
                            {customers.length > 0 &&
                                Object.keys(customers[0]).map((key, index) => (
                                <th key={index}>{columnMap[key] || key}</th>
                                ))
                            }
                            <th></th>
                        </tr>
                    </thead>
    
                    <tbody>
                        {customers.map((customer, index) => (
                            <TableRow key={index} rowObject={customer} backendURL={backendURL} refresh={getData} deleteEndpoint="/customers/delete" deleteIdKey="delete_customer_id" idColumnName="customer_id"/>
                        ))}
    
                    </tbody>
                </table>
                
                <CreateCustomerForm backendURL={backendURL} refreshCustomers={getData} />
                <UpdateCustomerForm customers={customers} backendURL={backendURL} refreshCustomers={getData} />               
            </>
        );

} export default Customers;
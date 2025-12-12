// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateOrderForm from '../components/CreateOrderForm';


function Orders({ backendURL }) {

    // Set up a state variable `people` to store and display the backend response
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);

    const columnMap = {
        order_id: "Order ID",
        first_name: "First Name",
        last_name: "Last Name",
        date: "Date",
        sale_amount: "Sale Amount"
      };

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/orders');
            
            // Convert the response into JSON format
            const {orders, customers} = await response.json();
    
            // Update the people state with the response data
            setOrders(orders);
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
            <h1>Orders</h1>

            <table>
                <thead>
                    <tr>
                        {orders.length > 0 &&
                            Object.keys(orders[0]).map((key, index) => (
                            <th key={index}>{columnMap[key] || key}</th>
                            ))
                        }
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order, index) => (
                        <TableRow key={index} rowObject={order} backendURL={backendURL} refresh={getData} deleteEndpoint="/orders/delete" deleteIdKey="delete_order_id" idColumnName="order_id"/>
                    ))}

                </tbody>
            </table>
            
            <CreateOrderForm customers={customers} backendURL={backendURL} refreshOrders={getData} />
        </>
    );

} export default Orders;
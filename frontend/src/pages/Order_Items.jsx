// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateOrderItemForm from '../components/CreateOrderItemForm';
import UpdateOrderItemForm from '../components/UpdateOrderItemForm';


function Order_Items({ backendURL }) {

    // Set up a state variable `people` to store and display the backend response
    const [order_items, setOrderItems] = useState([]);
    const [scores, setScores] = useState([]);
    const [orders, setOrders] = useState([]);

    const columnMap = {
        order_item_id: "Order Item ID",
        order_id: "Order ID",
        title: "Title",
        quantity: "Quantity",
        unit_price: "Unit Price",
        line_total: "Line Total"
      };


    const getData = async function () {
        try {
            console.log("Calling:", backendURL + '/order_items');

            // Make a GET request to the backend
            const response = await fetch(backendURL + '/order_items');
            
            // Convert the response into JSON format
            const {order_items, scores, orders} = await response.json();
    
            // Update the people state with the response data
            setOrderItems(order_items);
            setScores(scores);
            setOrders(orders);
            
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
            <h1>Order Items</h1>

            <table>
                <thead>
                    <tr>
                        {order_items.length > 0 &&
                            Object.keys(order_items[0]).map((key, index) => (
                            <th key={index}>{columnMap[key] || key}</th>
                            ))
                        }
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {order_items.map((order_item, index) => (
                        <TableRow key={index} rowObject={order_item} backendURL={backendURL} refresh={getData} deleteEndpoint="/order_items/delete" deleteIdKey="delete_order_item_id" idColumnName="order_item_id"/>
                    ))}

                </tbody>
            </table>
            
            <CreateOrderItemForm scores={scores} orders={orders} backendURL={backendURL} refreshOrderItems={getData} />
            <UpdateOrderItemForm order_items={order_items} scores={scores} backendURL={backendURL} refreshOrderItems={getData} />
        </>
    );

} export default Order_Items;
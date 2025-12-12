// Citation for the following code: Haruka Banin
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: All code in frontend is a modified version of the BSGPlanets react example
// adapted for our use case. This citation applies for all template/ui code.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Scores from './pages/Scores';
import Composers from './pages/Composers';
import Publishers from './pages/Publishers';
import Orders from './pages/Orders';
import Order_Items from './pages/Order_Items';
import Customers from './pages/Customers';
import Nationalities from './pages/Nationalities';
import Composition_Types from './pages/Composition_Types';
import Styles from './pages/Styles';


// Components
import Navigation from './components/Navigation';

// Define the backend port and URL for API requests
const backendPort = 9953;  // Use the port you assigned to the backend server, this would normally go in a .env file
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;

function App() {

    return (
        <>
            <h1>Aria Archive Management System</h1>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home backendURL={backendURL} />} />
                <Route path="/scores" element={<Scores backendURL={backendURL} />} />
                <Route path="/composers" element={<Composers backendURL={backendURL} />} />
                <Route path="/publishers" element={<Publishers backendURL={backendURL} />} />
                <Route path="/orders" element={<Orders backendURL={backendURL} />} />
                <Route path="/order_items" element={<Order_Items backendURL={backendURL} />} />
                <Route path="/customers" element={<Customers backendURL={backendURL} />} />
                <Route path="/nationalities" element={<Nationalities backendURL={backendURL} />} />
                <Route path="/composition_types" element={<Composition_Types backendURL={backendURL} />} />
                <Route path="/styles" element={<Styles backendURL={backendURL} />} />
            </Routes>
            <footer>
                <p>&copy; 2025 Aria Archive</p>
            </footer>
        </>
    );

} export default App;


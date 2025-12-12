// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import Reset from '../components/Reset';
import { Link } from "react-router-dom";

function Home({backendURL}) {
    return (
        <>
            <h1>Home page</h1>
            <div className="homepageDescription">
                <h2>Welcome to Aria Archive Managemenet System!</h2>
                <p>Page Descriptions</p>
                <p><Link to="/scores">Scores</Link> - Browse and manage our music score catalogue by composer, publisher, style, or type.</p>
                <p><Link to="/composers">Composers</Link> - View composer details, including life dates, nationality, and their works.</p>
                <p><Link to="/publishers">Publishers</Link> - Manage publisher info and see which scores they have released.</p>
                <p><Link to="/orders">Orders</Link> - Track all customer orders with dates, sale amounts, and purchased scores.</p>
                <p><Link to="/order_items">Order Items</Link> - View items in each order, including quantities, prices, and totals.</p>
                <p><Link to="/customers">Customers</Link> - Manage customer details and purchase history for smooth service.</p>
                <p><Link to="/nationalities">Nationalities</Link> - Organize composers by nationality for easy categorization.</p>
                <p><Link to="/composition_types">Composition Types</Link> - Categorize scores by type, such as sonatas, symphonies, or concertos.</p>
                <p><Link to="/styles">Styles</Link> - Classify music by style, from classical to contemporary.</p>
                <p>Created by Haruka Banin and Kelsey Shanks</p>
            </div>

            <Reset backendURL={backendURL} />
        </>
    )
} export default Home;
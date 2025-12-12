// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';
import CreateScoreForm from '../components/CreateScoreForm';
import UpdateScoreForm from '../components/UpdateScoreForm';


function Scores({ backendURL }) {

    // Set up a state variable `people` to store and display the backend response
    const [scores, setScores] = useState([]);
    const [composers, setComposers] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [composition_types, setCompositionTypes] = useState([]);
    const [styles, setStyles] = useState([]);
    const [sortBy, setSortBy] = useState('score_id');       // default sort column
    const [sortOrder, setSortOrder] = useState('ASC');   // default sort order

    const columnMap = {
        score_id: "Score ID",
        title: "Title",
        composer_name: "Composer",
        publisher_name: "Publisher",
        composition_type: "Composition Type",
        style: "Style",
        price: "Price"
      };

    const getData = async function () {
        try {
            const response = await fetch(`${backendURL}/scores?sortBy=${sortBy}&sortOrder=${sortOrder}`);
            const {scores, composers, publishers, composition_types, styles} = await response.json();
    
            setScores(scores);
            setComposers(composers);
            setPublishers(publishers);
            setCompositionTypes(composition_types);
            setStyles(styles);
    
        } catch (error) {
            console.log(error);
        }
    };

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Scores</h1>
            <div id="sort-section">
                <label htmlFor="sort-by">Sort by: </label>
                <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="score_id">Score ID</option>
                    <option value="title">Title</option>
                    <option value="composer_name">Composer</option>
                    <option value="publisher_name">Publisher</option>
                    <option value="composition_type">Type</option>
                    <option value="style">Style</option>
                </select>

                <select id="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                </select>

                <button onClick={getData}>Sort</button>
            </div>

            <table>
                <thead>
                    <tr>
                        {scores.length > 0 &&
                            Object.keys(scores[0]).map((key, index) => (
                            <th key={index}>{columnMap[key] || key}</th>
                            ))
                        }
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {scores.map((score, index) => (
                        <TableRow key={index} rowObject={score} backendURL={backendURL} refresh={getData} deleteEndpoint="/scores/delete" deleteIdKey="delete_score_id" idColumnName="score_id"/>
                    ))}
                </tbody>
            </table>
            
            <CreateScoreForm composers={composers} publishers={publishers} composition_types={composition_types} styles={styles} backendURL={backendURL} refreshScores={getData} />  
            <UpdateScoreForm scores={scores} backendURL={backendURL} refreshScores={getData} />          
        </>
    );

} export default Scores;
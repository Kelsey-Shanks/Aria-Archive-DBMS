// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

import DeleteForm from './DeleteForm';

const TableRow = ({ rowObject, backendURL, refresh, deleteEndpoint, deleteIdKey, idColumnName }) => {
    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}

            <DeleteForm idToDelete={rowObject[idColumnName]} idKey={deleteIdKey} endpoint={deleteEndpoint} backendURL={backendURL} refresh={refresh} />
        </tr>
    );
};

export default TableRow;
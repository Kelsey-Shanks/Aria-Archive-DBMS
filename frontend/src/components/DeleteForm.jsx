// Citation for the following code: 
// Date: 11/18/2025
// Based on example code on Canvas 'Exploration - Web Application Technology'
// Degree of originality: Used generated code as an example.
// Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131

const DeleteForm = ({ idToDelete, idKey, endpoint, backendURL, refresh }) => {

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if(!window.confirm("Are you sure you want to delete this?")) {
            return;
        }

        const formData = {
            [idKey]: idToDelete
        };

        try {      
            const response = await fetch(backendURL + endpoint, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (response.ok) {
                refresh();
                alert("Item deleted successfully.");
            } else {
                alert(result.message || "Error deleting item.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <td>
            <form onSubmit={handleSubmit}>
                <button type='submit'>
                    Delete
                </button>
            </form>
        </td>
    );
};

export default DeleteForm;

const Reset = ({ backendURL }) => {

    const handleReset = async () => {

        if (!window.confirm("WARNING: This will wipe all data and restore defaults.")) {
            return;
        }

        try {  
            const response = await fetch(backendURL + '/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                alert("Database reset successfully!");
                window.location.reload();
            } else {
                alert("Failed to reset database.");
            }
        } catch (error) {
            console.error('Error resetting database:', error);
        }
    };

    return (
        <button className="reset-button" onClick={handleReset}>
            Reset Database
        </button>
    );
};

export default Reset;
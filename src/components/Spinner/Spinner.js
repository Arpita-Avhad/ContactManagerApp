// src/components/Spinner/Spinner.js
import React from 'react';
import './Spinner.css'; // Import the CSS file for styling

const Spinner = () => {
    return (
        <div className="spinner">
            {/* You can customize this with any spinner graphics you prefer */}
            <div className="loader"></div>
        </div>
    );
};

export default Spinner;

import React from 'react';
import '../styles/CustomAlert.css'; 

const CustomAlert = ({ message, onConfirm, onCancel , isDarkMode }) => {
    return (
        <div className="custom-alert-overlay">
            <div className="custom-alert-box">
                <p>{message}</p>
                <div className="custom-alert-buttons">
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;

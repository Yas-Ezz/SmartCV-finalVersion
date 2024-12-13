import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HRHome.css'; // Add this CSS file for styling

const HRHome = () => {
    const navigate = useNavigate();

    return (
        <div className="hr-dashboard">
            <h1 className="dashboard-title">HR Dashboard</h1>
            <p className="dashboard-description">
                Welcome! Use the options below to manage job descriptions, upload CVs, and view matched results.
            </p>
            <div className="dashboard-buttons">
                <button onClick={() => navigate('/upload-job-description')} className="dashboard-button">
                    Upload Job Description
                </button>
                <button onClick={() => navigate('/upload-cvs')} className="dashboard-button">
                    Upload Candidate CVs
                </button>
                <button onClick={() => navigate('/view-matches')} className="dashboard-button">
                    View Matched Results
                </button>
            </div>
        </div>
    );
};

export default HRHome;

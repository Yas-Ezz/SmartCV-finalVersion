import React, { useState, useEffect } from 'react';
import axios from '../API/axios';
import './CandidateHome.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';

const CandidateHome = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [jobs, setJobs] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/api/departments', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setDepartments(response.data);
            } catch (error) {
                setErrorMessage('Failed to fetch departments.');
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            if (!selectedDepartment) {
                setJobs([]);
                return;
            }
            try {
                const response = await axios.get(`/api/job-descriptions?department_id=${selectedDepartment}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setJobs(response.data);
            } catch (error) {
                setErrorMessage('Failed to fetch jobs.');
            }
        };

        fetchJobs();
    }, [selectedDepartment]);

    const handleJobClick = (job) => navigate(`/job/${job.JobID}`);

    return (
        <div className="candidate-dashboard-container">
            <h1 className="dashboard-title">Candidate Dashboard</h1>
            <p className="dashboard-description">
                Select a department to view job opportunities.
            </p>
            <div className="form-group">
                <label htmlFor="department-select">Department:</label>
                <select
                    id="department-select"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="dropdown"
                >
                    <option value="">-- Select a Department --</option>
                    {departments.map((dept) => (
                        <option key={dept.DepartmentID} value={dept.DepartmentID}>
                            {dept.Name}
                        </option>
                    ))}
                </select>
            </div>
            {jobs.length > 0 && (
                <div className="jobs-container">
                    <h2>Available Jobs</h2>
                    <ul className="jobs-list">
                        {jobs.map((job) => (
                            <li
                                key={job.JobID}
                                className="job-item"
                                onClick={() => handleJobClick(job)}
                            >
                                <strong>{job.Title}</strong>
                                <p>{job.Description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default CandidateHome;

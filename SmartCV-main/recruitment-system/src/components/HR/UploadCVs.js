import React, { useState, useEffect } from 'react';
import axios from '../API/axios';
import './UploadCVs.css'; // Add a CSS file for styling

const UploadCVs = () => {
    const [candidateName, setCandidateName] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [cv, setCv] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/api/departments', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token
                    },
                });
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
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
                const response = await axios.get(`/api/jobs?department_id=${selectedDepartment}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, [selectedDepartment]);

    const handleFileChange = (e) => {
        setCv(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!candidateName || !selectedDepartment || !selectedJob || !cv) {
            setMessage('Please fill all required fields.');
            return;
        }

        const formData = new FormData();
        formData.append('candidate_name', candidateName);
        formData.append('department_id', selectedDepartment);
        formData.append('job_id', selectedJob);
        formData.append('cv', cv);

        try {
            const response = await axios.post('/api/upload-cv-hr', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMessage(response.data.message || 'CV uploaded successfully!');
        } catch (error) {
            setMessage('Error uploading CV.');
        }
    };

    return (
        <div className="upload-cv-container">
            <h1 className="upload-cv-title">Upload Candidate CVs</h1>
            <form onSubmit={handleSubmit} className="upload-cv-form">
                <div className="form-group">
                    <label>Candidate Name (Required):</label>
                    <input
                        type="text"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="Enter the candidate's name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Department (Required):</label>
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        required
                    >
                        <option value="">-- Select a Department --</option>
                        {departments.map((dept) => (
                            <option key={dept.DepartmentID} value={dept.DepartmentID}>
                                {dept.Name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Job (Required):</label>
                    <select
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        required
                    >
                        <option value="">-- Select a Job --</option>
                        {jobs.map((job) => (
                            <option key={job.JobID} value={job.JobID}>
                                {job.Title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Upload CV:</label>
                    <input type="file" onChange={handleFileChange} required />
                </div>
                <button type="submit" className="upload-cv-button">Upload CV</button>
            </form>
            {message && (
                <p className={`message ${message.includes('successfully') ? 'success-message' : 'error-message'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default UploadCVs;

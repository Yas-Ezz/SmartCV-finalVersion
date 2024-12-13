import React, { useState, useEffect } from 'react';
import axios from '../API/axios';
import './UploadJobDescription.css'; // Add a CSS file for styling

const UploadJobDescription = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [responsibilities, setResponsibilities] = useState('');
    const [requirements, setRequirements] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [message, setMessage] = useState('');

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
                setMessage('Failed to load departments.');
            }
        };

        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !responsibilities || !requirements || !selectedDepartment) {
            setMessage('All fields are required.');
            return;
        }

        const jobData = {
            title,
            description,
            responsibilities,
            requirements,
            department_id: selectedDepartment,
        };

        try {
            const response = await axios.post('/api/upload-job-description', jobData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setMessage(response.data.message || 'Job description uploaded successfully!');
            setTitle('');
            setDescription('');
            setResponsibilities('');
            setRequirements('');
            setSelectedDepartment('');
        } catch (error) {
            setMessage('Error uploading job description.');
        }
    };

    return (
        <div className="upload-job-container">
            <h1 className="upload-job-title">Upload Job Description</h1>
            <form onSubmit={handleSubmit} className="upload-job-form">
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter job title"
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Enter job description"
                    />
                </div>
                <div className="form-group">
                    <label>Responsibilities:</label>
                    <textarea
                        value={responsibilities}
                        onChange={(e) => setResponsibilities(e.target.value)}
                        required
                        placeholder="Enter responsibilities"
                    />
                </div>
                <div className="form-group">
                    <label>Requirements:</label>
                    <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        required
                        placeholder="Enter requirements"
                    />
                </div>
                <div className="form-group">
                    <label>Department:</label>
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
                <button type="submit" className="upload-job-button">Upload</button>
            </form>
            {message && (
                <p
                    className={`message ${
                        message.includes('successfully') ? 'success-message' : 'error-message'
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default UploadJobDescription;

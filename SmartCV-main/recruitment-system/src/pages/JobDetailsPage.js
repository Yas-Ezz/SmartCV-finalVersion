import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../components/API/axios';
import './JobDetailsPage.css';

const JobDetailsPage = () => {
    const { jobId } = useParams(); // Extract jobId from the URL
    const navigate = useNavigate(); // To navigate back
    const [jobDetails, setJobDetails] = useState(null);
    const [cv, setCv] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch job details
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`/api/job/${jobId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setJobDetails(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
                setMessage('Failed to load job details.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    const handleFileChange = (e) => {
        setCv(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobDetails) {
            setMessage('Job details not loaded. Cannot apply.');
            return;
        }

        const formData = new FormData();
        formData.append('cv', cv);
        formData.append('candidate_id', 1); // Replace with actual candidate ID
        formData.append('department_id', jobDetails.DepartmentID);
        formData.append('job_id', jobId);

        try {
            const response = await axios.post('/api/upload-cv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMessage(response.data.message || 'CV uploaded successfully!');
        } catch (error) {
            console.error('Error uploading CV:', error.response || error.message);
            setMessage(
                error.response?.data?.message || 'Error uploading CV. Please try again.'
            );
        }
    };

    if (loading) {
        return <p>Loading job details...</p>;
    }

    if (!jobDetails) {
        return <p>Failed to load job details. Please try again later.</p>;
    }

    return (
        <div className="job-details-container">
            <h1 className="job-title">{jobDetails.Title || 'Job Title'}</h1>
            <div className="job-description">
                <p><strong>Description:</strong> {jobDetails.Description || 'N/A'}</p>
                <p><strong>Responsibilities:</strong> {jobDetails.Responsibilities || 'N/A'}</p>
                <p><strong>Requirements:</strong> {jobDetails.Requirements || 'N/A'}</p>
            </div>
            <form onSubmit={handleSubmit} className="apply-form">
                <div className="form-group">
                    <label htmlFor="cv-upload">Upload CV:</label>
                    <input type="file" id="cv-upload" onChange={handleFileChange} required />
                </div>
                <button type="submit" className="apply-button">Apply for this Job</button>
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate(-1)} // Go back to the previous page
                >
                    Back to Jobs
                </button>
            </form>
            {message && (
                <p className={`message ${message.includes('successfully') ? 'success-message' : 'error-message'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default JobDetailsPage;

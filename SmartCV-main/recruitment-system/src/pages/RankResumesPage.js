import React, { useState } from 'react';
import axios from '../components/API/axios';

const RankResumesPage = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [resumes, setResumes] = useState([]);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setResumes([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('job_description', jobDescription);
        resumes.forEach((file) => formData.append('resumes', file));

        try {
            const response = await axios.post('/api/rank_resumes', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Resumes ranked successfully!');
            console.log(response.data);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error ranking resumes');
        }
    };

    return (
        <div>
            <h1>Rank Resumes</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Enter Job Description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                />
                <input type="file" multiple onChange={handleFileChange} required />
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RankResumesPage;

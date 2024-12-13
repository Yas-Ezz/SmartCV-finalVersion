import React, { useEffect, useState } from 'react';
import axios from '../components/API/axios';

const JobDescriptionsPage = () => {
    const [jobDescriptions, setJobDescriptions] = useState([]);

    useEffect(() => {
        const fetchJobDescriptions = async () => {
            try {
                const response = await axios.get('/api/job-descriptions'); // Replace with your actual endpoint
                setJobDescriptions(response.data);
            } catch (error) {
                console.error('Error fetching job descriptions:', error);
            }
        };

        fetchJobDescriptions();
    }, []);

    return (
        <div>
            <h1>Job Descriptions</h1>
            <ul>
                {jobDescriptions.map((job) => (
                    <li key={job.id}>{job.description}</li>
                ))}
            </ul>
        </div>
    );
};

export default JobDescriptionsPage;

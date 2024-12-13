import React, { useState, useEffect } from 'react';
import axios from '../API/axios';

const ViewMatches = () => {
    const [matches, setMatches] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get('/api/matched-cvs');
                setMatches(response.data);
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };
        fetchMatches();
    }, []);

    const handleSelectJob = (jobId) => {
        setSelectedJob(jobId);
    };

    return (
        <div>
            <h1>Matched CVs</h1>
            {matches.map((match) => (
                <div key={match.job_id}>
                    <h3>Job: {match.job_description}</h3>
                    <button onClick={() => handleSelectJob(match.job_id)}>View Matches</button>
                    {selectedJob === match.job_id && (
                        <ul>
                            {match.cvs.map((cv) => (
                                <li key={cv.id}>
                                    {cv.name} - {cv.similarity_score}%
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ViewMatches;

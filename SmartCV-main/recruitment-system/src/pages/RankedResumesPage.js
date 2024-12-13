import React, { useEffect, useState } from 'react';
import axios from '../components/API/axios';

const RankedResumesPage = () => {
    const [rankedResumes, setRankedResumes] = useState([]);

    useEffect(() => {
        const fetchRankedResumes = async () => {
            try {
                const response = await axios.get('/api/ranked-resumes'); // Replace with your actual endpoint
                setRankedResumes(response.data);
            } catch (error) {
                console.error('Error fetching ranked resumes:', error);
            }
        };

        fetchRankedResumes();
    }, []);

    return (
        <div>
            <h1>Ranked Resumes</h1>
            <ul>
                {rankedResumes.map((resume, index) => (
                    <li key={index}>
                        {resume.name} - {resume.similarity_score}%
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RankedResumesPage;

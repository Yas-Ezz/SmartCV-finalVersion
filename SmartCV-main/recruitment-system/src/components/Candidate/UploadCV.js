import React, { useState, useEffect } from 'react';
import axios from '../API/axios';
import Dropdown from '../Common/Dropdown';
import { toast } from 'react-toastify';

const UploadCV = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [cv, setCv] = useState(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/api/departments');
                setDepartments(response.data);
            } catch (error) {
                toast.error('Failed to fetch departments.');
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        if (!selectedDepartment) {
            setJobs([]);
            return;
        }
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`/api/jobs?department_id=${selectedDepartment}`);
                setJobs(response.data);
            } catch (error) {
                toast.error('Failed to fetch jobs.');
            }
        };

        fetchJobs();
    }, [selectedDepartment]);

    const handleFileChange = (e) => setCv(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDepartment || !selectedJob || !cv) {
            toast.error('All fields are required.');
            return;
        }

        const formData = new FormData();
        formData.append('department_id', selectedDepartment);
        formData.append('job_id', selectedJob);
        formData.append('cv', cv);

        try {
            await axios.post('/api/upload-cv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('CV uploaded successfully!');
            setSelectedDepartment('');
            setSelectedJob('');
            setCv(null);
        } catch (error) {
            toast.error('Error uploading CV.');
        }
    };

    return (
        <div>
            <h1>Upload Candidate CVs</h1>
            <form onSubmit={handleSubmit}>
                <Dropdown
                    options={departments}
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    placeholder="-- Select a Department --"
                />
                <Dropdown
                    options={jobs}
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    placeholder="-- Select a Job --"
                />
                <div>
                    <label>Upload CV:</label>
                    <input type="file" onChange={handleFileChange} required />
                </div>
                <button type="submit">Upload CV</button>
            </form>
        </div>
    );
};

export default UploadCV;

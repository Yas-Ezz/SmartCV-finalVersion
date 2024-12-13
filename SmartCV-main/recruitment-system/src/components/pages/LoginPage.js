import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../API/axios';
import './Auth.css'; // Import shared styles

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Redirect if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token && role) {
            if (role === 'Candidate') {
                navigate('/candidate', { replace: true }); // Redirect Candidate to their dashboard
            } else if (role === 'HR') {
                navigate('/hr', { replace: true }); // Redirect HR to their dashboard
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/login', { email, password });
            const { token, role } = response.data;

            // Store token and role in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Redirect based on role
            if (role === 'Candidate') {
                navigate('/candidate');
            } else if (role === 'HR') {
                navigate('/hr');
            } else {
                setErrorMessage('Invalid role.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error during login.');
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Log In</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="auth-button">Log In</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <p className="auth-footer">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default LoginPage;

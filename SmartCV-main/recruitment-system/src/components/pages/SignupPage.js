import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../API/axios';
import './Auth.css'; // Import shared styles

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('Submitting sign-up request:', { name, email, password, role }); // Debug
            const response = await axios.post('/api/signup', {
                name,
                email,
                password,
                role,
            });

            console.log('Response from backend:', response.data); // Debug

            // Show success message and clear form
            setMessage(response.data.message || 'Account created successfully!');
            setErrorMessage(''); // Clear error message
            setName('');
            setEmail('');
            setPassword('');
            setRole('');

            // Redirect to login page after a short delay only on successful signup
            setTimeout(() => {
                navigate('/');
            }, 3000); // Redirect after 3 seconds
        } catch (error) {
            console.error('Error during sign-up:', error.response || error); // Debug
            setMessage(''); // Clear success message
            setErrorMessage(
                error.response?.data?.message || 'Error during sign-up.'
            );

            // Stop redirection in case of error
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Sign Up</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter your name"
                    />
                </div>
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
                <div className="form-group">
                    <label>Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="">-- Select Role --</option>
                        <option value="Candidate">Candidate</option>
                        <option value="HR">HR</option>
                    </select>
                </div>
                <button type="submit" className="auth-button">Sign Up</button>
            </form>

            {/* Success or Error Messages */}
            {message && (
                <p className="success-message" style={{ color: 'green', marginTop: '10px', fontWeight: 'bold' }}>
                    {message}
                </p>
            )}
            {errorMessage && (
                <p className="error-message" style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default SignupPage;

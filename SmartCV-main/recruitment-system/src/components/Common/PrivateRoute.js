import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const role = localStorage.getItem('role'); // Get the user's role

    if (!token) {
        // If no token, redirect to login
        return <Navigate to="/" />;
    }

    if (!allowedRoles.includes(role)) {
        // If role is not allowed, redirect to login
        return <Navigate to="/" />;
    }

    // If token and role match, render the component
    return children;
};

export default PrivateRoute;

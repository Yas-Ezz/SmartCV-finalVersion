import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer'; // Add Footer component
import CandidateHome from './components/Candidate/CandidateHome';
import HRHome from './components/HR/HRHome';
import UploadJobDescription from './components/HR/UploadJobDescription';
import UploadCVs from './components/HR/UploadCVs';
import ViewMatches from './components/HR/ViewMatches';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import JobDetailsPage from './components/pages/JobDetailsPage';
import PrivateRoute from './components/Common/PrivateRoute'; // Role-based protected route
import Dashboard from './components/pages/Dashboard'; // New Landing Page

const App = () => {
    useEffect(() => {
        // Dynamically load the chatbot script
        const script = document.createElement('script');
        script.src = "https://www.chatbase.co/embed.min.js";
        script.defer = true;
        script.setAttribute('chatbotId', '72CVwtgfKijUBVEbsF1Pc');
        script.setAttribute('domain', 'www.chatbase.co');
        document.body.appendChild(script);

        return () => {
            // Cleanup the script on unmount
            document.body.removeChild(script);
        };
    }, []);

    return (
        <Router>
            <div>
                <Navbar />
                <div> {/* Adjust marginTop based on Navbar height */}
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Dashboard />} /> {/* New Landing Page */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        {/* Candidate Protected Routes */}
                        <Route
                            path="/candidate"
                            element={
                                <PrivateRoute allowedRoles={['Candidate']}>
                                    <CandidateHome />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/job/:jobId"
                            element={
                                <PrivateRoute allowedRoles={['Candidate']}>
                                    <JobDetailsPage />
                                </PrivateRoute>
                            }
                        />

                        {/* HR Protected Routes */}
                        <Route
                            path="/hr"
                            element={
                                <PrivateRoute allowedRoles={['HR']}>
                                    <HRHome />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/upload-job-description"
                            element={
                                <PrivateRoute allowedRoles={['HR']}>
                                    <UploadJobDescription />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/upload-cvs"
                            element={
                                <PrivateRoute allowedRoles={['HR']}>
                                    <UploadCVs />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/view-matches"
                            element={
                                <PrivateRoute allowedRoles={['HR']}>
                                    <ViewMatches />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
                <Footer /> {/* Footer Component */}
            </div>
        </Router>
    );
};

export default App;

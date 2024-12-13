import React from "react";
import "./MainPage.css"; // Import CSS for styling

const MainPage = () => {
  return (
    <div className="main-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">SmartCV</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#login">Log In</a></li>
          <li><a href="#documentation">Documentation</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Whether You're Hiring or Job Hunting, We're Here for You!</h1>
        <button className="hero-btn">Let's Start!</button>
        <p className="subtitle">Master Our Tools to Land Your Dream Job or Hire Top Talent</p>
      </header>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <img src="/path-to-icon1.png" alt="AI-Powered Job Matching" />
          <h3>AI-Powered Job Matching</h3>
          <p>Automatically analyzes job descriptions and finds the most relevant candidates.</p>
        </div>
        <div className="feature">
          <img src="/path-to-icon2.png" alt="Candidate Scoring and Ranking" />
          <h3>Candidate Scoring and Ranking</h3>
          <p>Displays ranked candidates based on compatibility with job requirements.</p>
        </div>
        <div className="feature">
          <img src="/path-to-icon3.png" alt="Real-Time Analytics" />
          <h3>Real-Time Analytics Dashboard</h3>
          <p>Insights on candidate matching scores, job postings, and applicant statistics.</p>
        </div>
        <div className="feature">
          <img src="/path-to-icon4.png" alt="CV Parsing" />
          <h3>CV Parsing</h3>
          <p>Automatically extracts key skills based on job postings.</p>
        </div>
        <div className="feature">
          <img src="/path-to-icon5.png" alt="Application Tracking" />
          <h3>Application Tracking</h3>
          <p>Allows applicants to track the status of their submissions in real-time.</p>
        </div>
        <div className="feature">
          <img src="/path-to-icon6.png" alt="Skill Match Analysis" />
          <h3>Skill Match Analysis</h3>
          <p>Provides feedback on how well CVs match job descriptions.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <button className="live-chat-btn">Live Chat</button>
        <p>Contact Us | SmartCV@gmail.com | +212567856392</p>
        <p>© 2024 SmartCV</p>
      </footer>
    </div>
  );
};

export default MainPage;

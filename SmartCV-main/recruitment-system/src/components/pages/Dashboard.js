import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const features = [
    {
      title: "AI-Powered Job Matching",
      desc: "Automatically analyzes job descriptions and finds the most relevant candidates.",
      icon: "/icons/ai-matching.png",
    },
    {
      title: "Candidate Scoring and Ranking",
      desc: "Displays ranked candidates based on compatibility with job requirements.",
      icon: "/icons/scoring.png",
    },
    {
      title: "Real-Time Analytics Dashboard",
      desc: "Insights on candidate matching scores, job postings, and applicant statistics.",
      icon: "/icons/analytics.png",
    },
    {
      title: "CV Parsing",
      desc: "Automatically extracts key skills based on job postings.",
      icon: "/icons/cv-parsing.png",
    },
    {
      title: "Application Tracking",
      desc: "Allows applicants to track the status of their submissions in real-time.",
      icon: "/icons/tracking.png",
    },
    {
      title: "Skill Match Analysis",
      desc: "Provides feedback on how well CVs match job descriptions.",
      icon: "/icons/skill-matching.png",
    },
  ];

  return (
    <div className="dashboard">

      {/* Hero Section */}
      <section className="hero">
  <h1>
    Whether You're Hiring or Job Hunting, <br />
    We're Here for You!
  </h1>
  <button
    className="btn hero-btn"
    onClick={() => window.location.href = "/login"}
  >
    Let’s Start!
  </button>
</section>


      {/* Blue Tagline Box */}
      <section className="tagline-box">
        <p>Master Our Tools to Land Your Dream Job or Hire Top Talent</p>
      </section>

      {/* Features Section */}
      <section className="features-section">
  <h2>Our Features</h2> {/* Section title */}
  <div className="features">
  <div className="feature-box">
    <h3>AI-Powered Job Matching</h3>
    <p>Automatically analyzes job descriptions and finds the most relevant candidates.</p>
  </div>
  <div className="feature-box">
    <h3>Candidate Scoring and Ranking</h3>
    <p>Displays ranked candidates based on compatibility with job requirements.</p>
  </div>
  <div className="feature-box">
    <h3>Real-Time Analytics Dashboard</h3>
    <p>Insights on candidate matching scores, job postings, and applicant statistics.</p>
  </div>
  <div className="feature-box">
    <h3>CV Parsing</h3>
    <p>Automatically extracts key skills based on job postings.</p>
  </div>
  <div className="feature-box">
    <h3>Application Tracking</h3>
    <p>Allows applicants to track the status of their submissions in real-time.</p>
  </div>
  <div className="feature-box">
    <h3>Skill Match Analysis</h3>
    <p>Provides feedback on how well CVs match job descriptions.</p>
  </div>
</div>

</section>



      {/* Footer */}
      <footer className="footer">
        <p>Contact Us: <a href="mailto:SmartCV@gmail.com">SmartCV@gmail.com</a> | +212567856392</p>
        <p>© 2024 SmartCV</p>
      </footer>
    </div>
  );
};

export default Dashboard;

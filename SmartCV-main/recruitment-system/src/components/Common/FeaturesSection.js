import React from "react";
import "./FeaturesSection.css";

const FeaturesSection = () => (
  <div className="features-container">
    <h2>Why Choose SmartCV?</h2>
    <div className="features-grid">
      <div className="feature-item">
        <img src="/assets/icon-1.png" alt="Feature 1" />
        <h3>AI-Powered Matching</h3>
        <p>Save time by matching candidates to job descriptions effortlessly.</p>
      </div>
      <div className="feature-item">
        <img src="/assets/icon-2.png" alt="Feature 2" />
        <h3>Customizable Pipelines</h3>
        <p>Organize and track recruitment processes your way.</p>
      </div>
      <div className="feature-item">
        <img src="/assets/icon-3.png" alt="Feature 3" />
        <h3>Resume Parsing</h3>
        <p>Extract key details from resumes instantly.</p>
      </div>
      <div className="feature-item">
        <img src="/assets/icon-4.png" alt="Feature 4" />
        <h3>Analytics Dashboard</h3>
        <p>Monitor recruitment performance with insightful analytics.</p>
      </div>
    </div>
  </div>
);

export default FeaturesSection;

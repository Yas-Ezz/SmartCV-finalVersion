import React from "react";
import "./HeroSection.css";

const HeroSection = () => (
  <div className="hero-container">
    <div className="hero-content">
      <h1>Recruit Smarter, Faster, Better</h1>
      <p>
        Revolutionize your hiring process with AI-powered tools that help you find and hire the best talent.
      </p>
      <div className="hero-buttons">
        <button className="btn-primary">Start Free Trial</button>
        <button className="btn-secondary">Book a Demo</button>
      </div>
    </div>
    <div className="hero-image">
      <img src="C:\Users\Administrateur\Desktop\SmartCV-main\recruitment-system\assets\hero-image.png" alt="Recruitment Dashboard" />
    </div>
  </div>
);

export default HeroSection;

import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">SmartCV</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Log In</Link></li>
        <li><Link to="/signup">Sign up</Link></li>
        <li><Link to="/documentation">Documentation</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

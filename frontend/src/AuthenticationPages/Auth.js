import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // See CSS below

const UniNotes = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="background">
      <div className="container">
        <img
          src="/UniNotesLogoReact.jpg" // Replace with your logo/icon path
          alt="UniNotes Logo"
          className="logo"
        />
        <h1>
          <span className="uni">Uni</span>
          <span className="notes">Notes</span>
        </h1>
        <p className="subtitle">
          Your One-Stop Solution<br />
          For All Your Academics Need!
        </p>
        <button className="login-btn" onClick={handleLoginClick}>
          Log In
        </button>
        <p className="signup-text">
          Don’t have an account? <a href="/signup" className="signup-link">SignUp Here</a>
        </p>
      </div>
    </div>
  );
};

export default UniNotes;

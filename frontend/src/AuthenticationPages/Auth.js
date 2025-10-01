import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const UniNotes = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="backgroundAuth mobile-background">
      <div className="containerAuth mobile-container">
        <div className="logo-block">
          <img
            src="/UniNotesLogoReact.jpg"
            alt="UniNotes Logo"
            className="logoAuth mobile-logo"
          />
        </div>
        <div className="title-block">
          <h1 className="mobile-title">
            <span className="uniAuth">Uni</span>
            <span className="notesAuth">Notes</span>
          </h1>
        </div>
        <p className="subtitleAuth mobile-subtitle">
          Your One-Stop Solution<br />
          For All Your Academics Need!
        </p>
        <button className="login-btnAuth mobile-login-btn" onClick={handleLoginClick}>
          Log In
        </button>
        <p className="signup-textAuth mobile-signup-text">
          Don’t have an account?{' '}
          <a href="/signup" className="signup-linkAuth">SignUp Here</a>
        </p>
      </div>
    </div>
  );
};

export default UniNotes;


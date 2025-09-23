import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importing all the authentication-related pages
import AuthPage from './AuthenticationPages/Auth';
import SignupPage from './AuthenticationPages/SignupPage';
import LoginPage from './AuthenticationPages/LoginPage';
import EmailOtp from './AuthenticationPages/EmailOtp';
import PasswordReset from './AuthenticationPages/PasswordReset';
import PasswordOtp from './AuthenticationPages/PasswordOtp';
import SetNewPassword from './AuthenticationPages/SetNewPassword';
import GoogleLoginPage from './AuthenticationPages/google';
// Importing the home page-related pages
import HomePage from './HomePage/HomePage';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Defining routes for each authentication page */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/EmailOtp" element={<EmailOtp />} />
          <Route path="/PasswordReset" element={<PasswordReset />} />
          <Route path="/PasswordOtp" element={<PasswordOtp />} />
          <Route path="/SetNewPassword" element={<SetNewPassword />} />
          <Route path="/google" element={<GoogleLoginPage />} />

          {/* Route for the home page */}
          <Route path="/home" element={<HomePage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;


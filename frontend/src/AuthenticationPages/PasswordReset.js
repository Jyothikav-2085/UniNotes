import React, { useState } from 'react';
import './PasswordReset.css'; // Import the CSS file
import { TextField } from '@mui/material';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {

  const [email, setEmail] = useState('');

  const navigate = useNavigate();

 async function handleEmailForPasswordReset(email) {
  if (!email) {
    toast.error('No registered email entered.', { duration: 3000 });
    return;
  }

  try {
    const response = await fetch('http://localhost:5001/otp/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok && data.exists) {
      toast.success('Email is registered! Verify the OTP to reset password.', { duration: 4000 });
      navigate('/PasswordOtp', { state: { email } });
    } else {
      toast.error('Email is not registered.', { duration: 3000 });
    }
  } catch (error) {
    toast.error('Error checking email. Please try again.', { duration: 3000 });
  }
}


  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      handleEmailForPasswordReset(email);
    } else {
      toast.error('Please enter your registered email.', { duration: 3000 });
    }
  };

  return (
    <>
      <Toaster />
      <div className="wrapperPasswordReset">
        <div className="leftPanelPasswordReset">
          <img
            className="illustrationPasswordReset"
            src="/PasswordResetIllustration.jpg"
            alt="Reset Password Illustration"
          />
          <div className="leftTextPasswordReset"><strong>Reset Your Password</strong></div>
        </div>
        <div className="rightPanelPasswordReset">
          <div className="headingPasswordReset">Reset Password</div>
          <div className="underlinePasswordReset"></div>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Enter Registered Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                backgroundColor: 'white',
                marginBottom: '17px',
                width: '103.5%',
                '& .MuiInputLabel-root.Mui-focused': { color: '#c09319ff' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#c09319ff',
                },
                borderRadius: '6px',
              }}
            />
            <button type="submit" className="buttonPasswordReset">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

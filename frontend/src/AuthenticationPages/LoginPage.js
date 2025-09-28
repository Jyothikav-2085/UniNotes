import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
// Material UI imports
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const socialIcons = [{ label: <strong>G</strong> }];

export default function LoginPage() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClickShowPassword = () => {
    setShowLoginPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginEmail: loginEmail.toLowerCase(), loginPassword }),
      });
      if (res.ok) {
        toast.success('Login successful!', { position: 'top-center', duration: 3000 });
        setTimeout(() => navigate('/home'), 2500);
      } else {
        const data = await res.json();
        toast.error('Login failed: ' + (data.error || data.message), { position: 'top-center', duration: 3000 });
      }
    } catch (error) {
      toast.error('Error: ' + error.message, { position: 'top-center', duration: 3000 });
    }
  };

  return (
    <>
      <Toaster />
      <div
        className={`wrapperLogin`}
        style={{
          backgroundSize: 'cover',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Circles */}
        <div className={`circleBG leftCircleLogin ${animate ? 'circleIn' : ''}`}></div>
        <div className={`circleBG rightCircleLogin ${animate ? 'circleIn' : ''}`}></div>

        {/* Animated Panels */}
        <div className={`leftPanelLogin ${animate ? 'fadeSlideIn' : ''}`}>
          <img className="illustrationLogin" src="/LogInIllustration.jpg" alt="LogIn Illustration" />
          <div className="leftTextLogin"><strong>Login to your account</strong></div>
        </div>
        <div className={`rightPanelLogin ${animate ? 'fadeSlideIn' : ''}`}>
          <div className="headingLogin">Log In</div>
          <div className="underlineLogin"></div>

          <form onSubmit={handleSubmit}>
            <TextField
              id="outlined-email"
              label="Registered Email"
              variant="outlined"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              sx={{
                marginBottom: '17px',
                borderRadius: '6px',
                width: '103.5%',
                backgroundColor: 'white',
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#d99201',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d99201',
                },
              }}
            />

            <FormControl sx={{ width: '103.5%', marginBottom: '17px' }} variant="outlined">
              <InputLabel
                htmlFor="outlined-adornment-password"
                sx={{ '&.Mui-focused': { color: '#d99201' } }}
              >
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showLoginPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showLoginPassword ? 'hide password' : 'show password'}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showLoginPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                required
                sx={{
                  backgroundColor: 'white',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d99201',
                  },
                }}
              />
            </FormControl>

            <button className="buttonLogin" type="submit">Log In</button>
          </form>

          <div className="orLoginSignUp" style={{ marginBottom: '-10px' }}>Or login with</div>
          <div
            className="socialRowLogin"
            style={{ marginLeft: '195px', justifyContent: 'center', marginBottom: '5px', marginTop: '20px' }}
          >
            {socialIcons.map((icon, index) => (
              <button
                key={index}
                className="socialIconLogin"
                onClick={() => navigate('/google')}
              >
                {icon.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="forgotLinkLogin"
            onClick={() => navigate('/PasswordReset')}
          >
            Forgot password?
          </button>

          <div className="signupRedirectLogin">
            Don't have an account?
            <span className="signupLinkLogin" onClick={() => navigate('/signup')}>SignUp Here</span>
          </div>
        </div>
      </div>
    </>
  );
}

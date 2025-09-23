import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';
// material ui
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const socialIcons = [{ label: <strong>G</strong> }];

export default function SignupPage() {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
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
      const res = await fetch('http://localhost:5001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        toast.success('Signup successful! Please verify your email.', { position: 'top-center', duration: 3000 });
        navigate('/EmailOtp', { state: { email } });
      }
      else {
        const data = await res.json();
        toast.error('Signup failed: ' + (data.error || data.message), { position: 'top-center', duration: 3000 });
      }
    } catch (error) {
      toast.error('Error: ' + error.message, { position: 'top-center', duration: 3000 });
    }
  };


  //jsx components
  return (
    <>
      <Toaster />
      <div className="wrapperSignUp">
        <div className="leftPanelSignUp">
          <img className="illustrationSignUp" src="/SignupIllustration.png" alt="Signup Illustration" />
          <div className="leftTextSignUp"><strong>Create an account</strong></div>
        </div>
        <div className="rightPanelSignUp">
          <div className="headingSignUp">Sign Up</div>
          <div className="underlineSignUp"></div>

          <form onSubmit={handleSubmit}>

            {/* Full name as MUI TextField */}
            <TextField
              label="Full name"
              variant="outlined"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              slotProps={{
                input: {
                  minLength: 3,
                  maxLength: 100
                }
              }}
              sx={{
                backgroundColor: 'white',
                marginBottom: '17px',
                width: '103.5%',
                '& .MuiInputLabel-root.Mui-focused': { color: '#1667EB' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1667EB',
                },
                borderRadius: '6px',
              }}
            />

            {/* Email as MUI TextField */}
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                backgroundColor: 'white',
                marginBottom: '17px',
                width: '103.5%',
                '& .MuiInputLabel-root.Mui-focused': { color: '#1667EB' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1667EB',
                },
                borderRadius: '6px',
              }}
            />

            {/* Password as before */}
            <FormControl sx={{ width: '103.5%', marginBottom: '17px' }} variant="outlined">
              <InputLabel
                htmlFor="outlined-adornment-password"
                sx={{ '&.Mui-focused': { color: '#1667EB' } }}
              >
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'hide password' : 'show password'}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                required
                sx={{
                  backgroundColor: 'white', '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1667EB',
                  }
                }}
              />
            </FormControl>

            <button type="submit" className="buttonSignUp">Sign Up</button>
          </form>

          <div className="orLoginSignUp">Or login with</div>
          <div className="socialRowSignUp">
            {socialIcons.map((icon) => (
              <button
                key={icon.label}
                className="socialIconSignUp"
                style={{ color: icon.color }}
                onClick={() => navigate('/google')}
              >
                {icon.label}
              </button>
            ))}
          </div>

          <div className="loginRedirectSignUp">
            Already have an account?
            <span className="loginLinkSignUp" onClick={() => navigate('/login')}>LogIn Here</span>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import './SetNewPassword.css'; // Import the CSS file
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { toast, Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Visibility1 from '@mui/icons-material/Visibility';
import VisibilityOff1 from '@mui/icons-material/VisibilityOff';
import Visibility2 from '@mui/icons-material/Visibility';
import VisibilityOff2 from '@mui/icons-material/VisibilityOff';

export default function ResetPasswordPage() {

  const location = useLocation();

  const userEmail = location.state?.email || '';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };


  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      toast.error('No registered email available', { duration: 3000 });
      return;
    }

    if (!password || !confirmPassword) {
      toast.error('Please enter and confirm your new password', { duration: 3000 });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', { duration: 3000 });
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/otp/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          newPassword: password,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Password updated successfully!', { duration: 3000 });
        // Optionally navigate to login or home page after password reset
       
          navigate('/login'); // Change path as needed
       
      } else {
        toast.error('Failed to update password: ' + (data.error || 'Unknown error'), { duration: 3000 });
      }
    } catch (error) {
      toast.error('Server error updating password: ' + error.message, { duration: 3000 });
    }
  };


  //jsx components
  return (
    <>
      <Toaster />
      <div className="wrapperNewPassword">
        <div className="leftPanelNewPassword">
          <img
            className="illustrationNewPassword"
            src="/PasswordResetIllustration.jpg"
            alt="Reset Password Illustration"
          />
          <div className="leftTextNewPassword"><strong>Set your new password</strong></div>
        </div>
        <div className="rightPanelNewPassword">
          <div className="headingNewPassword">Set a New Password</div>
          <div className="underlineNewPassword"></div>
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ width: '103.5%', marginBottom: '17px' }} variant="outlined">
              <InputLabel
                htmlFor="outlined-adornment-password"
                sx={{ '&.Mui-focused': { color: '#c09319ff' } }}
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
                      {showPassword ? <Visibility1 /> : <VisibilityOff1 />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                required
                sx={{
                  backgroundColor: 'white',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#c09319ff',
                  },
                }}
              />
            </FormControl>

            <FormControl sx={{ width: '103.5%', marginBottom: '17px' }} variant="outlined">
              <InputLabel
                htmlFor="outlined-adornment-confirm-password"
                sx={{ '&.Mui-focused': { color: '#c09319ff' } }}
              >
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirmPassword ? 'hide password' : 'show password'}
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility2 /> : <VisibilityOff2 />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
                required
                sx={{
                  backgroundColor: 'white',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#c09319ff',
                  },
                }}
              />
            </FormControl>



            <button type="submit" className="buttonNewPassword">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import './EmailOtp.css';

export default function EmailOtp() {
  const location = useLocation();
  const userEmail = location.state?.email || '';

  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const [timer, setTimer] = useState(0);
  const [sending, setSending] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^[0-9]$/.test(val) || val === '') {
      e.target.value = val;
      if (val !== '' && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    } else {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSendOtp = async () => {
    if (!userEmail) {
      toast.error('No email available to send OTP', { position: 'top-center', duration: 3000 });
      return;
    }
    setSending(true);
    try {
      const res = await fetch('http://localhost:5001/otp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      if (res.ok) {
        toast.success(`OTP sent to ${userEmail}`, { position: 'top-center', duration: 3000 });
        setTimer(120);
        let countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              setSending(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        const data = await res.json().catch(() => ({}));
        const errorMsg = data.error || `Failed to send OTP (status ${res.status})`;
        if (res.status === 429 && data.error === 'Exceeded OTP limit') {
          toast.error('Exceeded OTP limit! Try after 6 hrs', { position: 'top-center', duration: 3000 });
        } else {
          toast.error(errorMsg, { position: 'top-center', duration: 3000 });
        }
        setSending(false);
      }
    } catch (err) {
      toast.error(`Error sending OTP: ${err.message}`, { position: 'top-center', duration: 3000 });
      setSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = inputRefs.current.map(input => input.value).join('');

    if (otp.length !== 6) {
      toast.error('Please enter all 6 digits of the OTP', { position: 'top-center', duration: 3000 });
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/otp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, otp }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
  const { userId, userName } = data;   // Extract userId and userName from response data
  console.log('Storing to localStorage:', userId, userName);

  if (userId && userName) {
    localStorage.setItem('loggedInUserId', userId);
    localStorage.setItem('loggedInUserName', userName);
  } else {
    console.warn("User info not found in OTP verify response.");
  }
        setTimeout(() => {
          navigate('/home', { state: { message: 'OTP verified successfully!' } });
        }, 2500);
      } else {
        toast.error('OTP verification failed: ' + (data.error || 'Invalid OTP'), { position: 'top-center', duration: 3000 });
      }
    } catch (error) {
      toast.error('Error verifying OTP: ' + error.message, { position: 'top-center', duration: 3000 });
    }
  };

  return (
    <>
      <Toaster />
      <div className="wrapper" style={{ backgroundSize: 'cover', position: 'relative', overflow: 'hidden' }}>
        {/* Circles */}
        <div className={`circleBG leftCircle ${animate ? 'circleIn' : ''}`}></div>
        <div className={`circleBG rightCircle ${animate ? 'circleIn' : ''}`}></div>
        {/* Panels */}
        <div className={`leftPanel ${animate ? 'fadeSlideIn' : ''}`}>
          <img
            className="illustration"
            src="/OtpVerificationIllustration.png"
            alt="OTP Verification Illustration"
          />
          <div className="leftText"><strong>Verify Your Email</strong></div>
          <button
            className="button sendOtpButton"
            onClick={handleSendOtp}
            disabled={sending || timer > 0}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Send OTP'}
          </button>
        </div>

        <div className={`rightPanel ${animate ? 'fadeSlideIn' : ''}`}>
          <div className="heading">Email OTP Verification</div>
          <div className="underline"></div>

          <form onSubmit={handleSubmit}>
            <div className="otpContainer">
              {[...Array(6)].map((_, idx) => (
                <input
                  key={idx}
                  ref={el => (inputRefs.current[idx] = el)}
                  type="text"
                  maxLength="1"
                  className="otpInput"
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            <button type="submit" className="button">Verify OTP</button>
          </form>

          <div className="infoText">
            <span
              onClick={timer > 0 ? undefined : handleSendOtp}
              style={{ color: timer > 0 ? 'gray' : undefined, pointerEvents: timer > 0 ? 'none' : 'auto' }}
            >
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

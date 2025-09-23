import React, { useRef, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import './PasswordOtp.css';

export default function PasswordOtp() {

    const location = useLocation();
    const userEmail = location.state?.email || '';

    const navigate = useNavigate();

    const inputRefs = useRef([]);

    const [timer, setTimer] = useState(0);
    const [sending, setSending] = useState(false);

    // otp allowing only numbers
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

    //No spaces are allowed in otp
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // sending otp to the email
    const handleSendOtpResetPassword = async (e) => {
        e.preventDefault();

        if (!userEmail) {
            toast.error('No email available to send OTP', { position: 'top-center', duration: 3000 });
            return;
        }

        setSending(true);

        try {
            const res = await fetch('http://localhost:5001/otp/send-resetpassword-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail }),
            });

            if (res.ok) {
                toast.success(`Reset password OTP sent to ${userEmail}`, { position: 'top-center', duration: 3000 });
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
                const data = await res.json();
                if (res.status === 429 && data.error === 'Exceeded OTP limit') {
                    toast.error('Exceeded OTP limit! Try after 6 hrs', { position: 'top-center', duration: 3000 });
                } else if (res.status === 400 && data.error === 'Email not registered') {
                    toast.error('Email is not registered.', { position: 'top-center', duration: 3000 });
                } else {
                    toast.error('Failed to send reset OTP', { position: 'top-center', duration: 3000 });
                }
                setSending(false);
            }
        } catch (error) {
            toast.error('Error sending reset OTP: ' + error.message, { position: 'top-center', duration: 3000 });
            setSending(false);
        }
    };


    // verification of otp or finding errors in the submission of otp 
    const handleSubmitResetPassword = async (e) => {
        e.preventDefault();

        const otp = inputRefs.current.map(input => input.value).join('');

        if (otp.length !== 6) {
            toast.error('Please enter all 6 digits of the OTP', { position: 'top-center', duration: 3000 });
            return;
        }

        if (!userEmail) {
            toast.error('No email available for OTP verification', { position: 'top-center', duration: 3000 });
            return;
        }

        try {
            const res = await fetch('http://localhost:5001/otp/verify-resetpassword-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, otp }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success('Reset password OTP verified successfully!', { position: 'top-center', duration: 3000 });
                
                    // Navigate to new password creation page or wherever next step is
                    navigate('/SetNewPassword', { state: { email: userEmail } });
                
            } else {
                toast.error('OTP verification failed: ' + (data.error || 'Invalid OTP'), { position: 'top-center', duration: 3000 });
            }
        } catch (error) {
            toast.error('Error verifying OTP: ' + error.message, { position: 'top-center', duration: 3000 });
        }
    };



    //jsx components
    return (
        <>
            <Toaster />
            <div className="PasswordOtpwrapper">
                <div className="PasswordOtpleftPanel">
                    <img
                        className="PasswordOtpillustration"
                        src="/OtpVerificationIllustration.png"
                        alt="OTP Verification Illustration"
                    />
                    <div className="PasswordOtpleftText"><strong>Verify Your Email</strong></div>
                    <button
                        className="PasswordOtpbutton PasswordOtpsendOtpButton"
                        onClick={handleSendOtpResetPassword}
                        disabled={sending || timer > 0}
                    >
                        {timer > 0 ? `Resend OTP in ${timer}s` : 'Send OTP'}
                    </button>
                </div>
                <div className="PasswordOtprightPanel">
                    <div className="PasswordOtpheading">Email OTP Verification</div>
                    <div className="PasswordOtpunderline"></div>
                    <form onSubmit={handleSubmitResetPassword}>
                        <div className="PasswordOtpotpContainer">
                            {[...Array(6)].map((_, idx) => (
                                <input
                                    key={idx}
                                    ref={el => (inputRefs.current[idx] = el)}
                                    type="text"
                                    maxLength="1"
                                    className="PasswordOtpotpInput"
                                    onChange={(e) => handleChange(e, idx)}
                                    onKeyDown={(e) => handleKeyDown(e, idx)}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    autoComplete="one-time-code"
                                />
                            ))}
                        </div>
                        <button type="submit" className="PasswordOtpbutton">Verify OTP</button>
                    </form>
                    <div className="PasswordOtpinfoText">
                        <span
                            onClick={timer > 0 ? undefined : handleSendOtpResetPassword}
                            style={{ color: timer > 0 ? 'gray' : undefined, pointerEvents: timer > 0 ? 'none' : 'auto' }}
                        >
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

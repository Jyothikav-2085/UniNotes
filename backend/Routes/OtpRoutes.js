import express from 'express';
import nodemailer from 'nodemailer';
import connection from '../db.js';
import { EmailOtpController, markOtpVerified } from '../AuthControllers/EmailOtpControllers.js';
const router = express.Router();

{/*------------------------------------------------------------------------------------------------------------*/ }
// Endpoint to verify OTP to login
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP required' });
  }

  try {
    const storedOtp = await EmailOtpController(email);

    if (!storedOtp) return res.status(400).json({ error: 'No OTP found' });

    if (new Date() > new Date(storedOtp.OTP_expiresAt)) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (otp.toString().trim() !== storedOtp.otp.toString().trim()) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    await markOtpVerified(email);

    // Now copy signup credentials into login table
    connection.query('SELECT password FROM signup WHERE email = ?', [email], (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ error: 'User not found for login creation' });
      }
      const password = results[0].password;
      connection.query(
        'INSERT INTO login (login_email, login_password) VALUES (?, ?)',
        [email, password],
        (loginErr) => {
          if (loginErr) {
            return res.status(500).json({ error: 'Failed to create login data' });
          }

          // Only now send success!
          return res.json({ success: true });

        }
      );
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Server error verifying OTP' });
  }
});







// Endpoint to send OTP to login
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const sixHoursAgo = new Date(Date.now() - (6 * 60 * 60 * 1000));
  const countQuery = `
    SELECT COUNT(*) AS count
    FROM email_otps
    WHERE OTP_email = ? AND OTP_createdAt > ?
  `;

  connection.query(countQuery, [email, sixHoursAgo], (countErr, countResults) => {
    if (countErr) {
      console.error('Error counting OTPs:', countErr);
      return res.status(500).json({ error: 'Server error' });
    }

    if (countResults[0].count >= 3) {
      return res.status(429).json({ error: 'Exceeded OTP limit' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    transporter.sendMail({
      to: email,
      subject: 'UniNotes',
      html: `<p>Welcome to <strong>UniNotes</strong></p>
             <p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>
             <p>Do not share this OTP with anyone.</p>`,
    }, (mailErr) => {
      if (mailErr) {
        console.error('Error sending OTP email:', mailErr);
        return res.status(500).json({ error: 'Failed to send OTP email' });
      }

      console.log('Login OTP sent');

      const expiresAt = new Date(Date.now() + 5 * 60000);
      const insertOtpQuery = `
        INSERT INTO email_otps (OTP_email, otp, OTP_expiresAt)
        VALUES (?, ?, ?)
      `;
      connection.query(insertOtpQuery, [email, otp, expiresAt], (insertErr) => {
        if (insertErr) {
          console.error('Error saving OTP', insertErr);
        }
        return res.json({ success: true });
      });
    });
  });
});






{/*------------------------------------------------------------------------------------------------------------*/ }
// Endpoint to check if email is registered to reset password
router.post('/check-email', (req, res) => {
  const { email } = req.body;
  connection.query('SELECT 1 FROM signup WHERE email = ? LIMIT 1', [email], (err, results) => {
    if (err) {
      console.error('Error checking email existence:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (results.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  });
});





//endpoint to send otp to reset password
router.post('/send-resetpassword-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  connection.query('SELECT 1 FROM signup WHERE email = ? LIMIT 1', [email], (emailErr, emailResults) => {
    if (emailErr) {
      console.error('Error checking email before sending reset OTP:', emailErr);
      return res.status(500).json({ error: 'Server error' });
    }
    if (emailResults.length === 0) {
      return res.status(400).json({ error: 'Email not registered' });
    }

    const sixHoursAgo = new Date(Date.now() - (6 * 60 * 60 * 1000));
    const countQuery = `
      SELECT COUNT(*) AS count
FROM password_reset_otps
WHERE Reset_OTP_email = ? AND Reset_OTP_createdAt > ?

    `;

    connection.query(countQuery, [email, sixHoursAgo], (countErr, countResults) => {
      if (countErr) {
        console.error('Error counting reset OTPs:', countErr);
        return res.status(500).json({ error: 'Server error' });
      }

      if (countResults[0].count >= 3) {
        return res.status(429).json({ error: 'Exceeded OTP limit' });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.PASSWORD_RESET_EMAIL_HOST,
        port: Number(process.env.PASSWORD_RESET_EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.PASSWORD_RESET_EMAIL_USER,
          pass: process.env.PASSWORD_RESET_EMAIL_PASS,
        },
      });

      transporter.sendMail({
        to: email,
        subject: 'UniNotes Password Reset',
        html: `<p>Welcome to <strong>UniNotes</strong></p>
              <p>You requested to reset your UniNotes password.</p>
               <p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>
               <p>Do not share this OTP with anyone.</p>`,
      }, (mailErr) => {
        if (mailErr) {
          console.error('Error sending reset password OTP email:', mailErr);
          return res.status(500).json({ error: 'Failed to send OTP email' });
        }

        console.log('Reset password OTP sent');

        const expiresAt = new Date(Date.now() + 5 * 60000);
        const insertOtpQuery = `
          INSERT INTO password_reset_otps (Reset_OTP_email, Reset_otp, Reset_OTP_expiresAt)
          VALUES (?, ?, ?)
        `;
        connection.query(insertOtpQuery, [email, otp, expiresAt], (insertErr) => {
          if (insertErr) {
            console.error('Error saving reset OTP', insertErr);
          }
          return res.json({ success: true });
        });
      });
    });
  });
});




//verification of password reset otp to reset password
router.post('/verify-resetpassword-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP required' });
  }

  try {
    connection.query(
      'SELECT * FROM password_reset_otps WHERE Reset_OTP_email = ? ORDER BY Reset_OTP_createdAt DESC LIMIT 1',
      [email],
      (err, results) => {
        if (err) {
          console.error('Error fetching reset OTP:', err);
          return res.status(500).json({ error: 'Server error fetching OTP' });
        }

        if (results.length === 0) {
          return res.status(400).json({ error: 'No OTP found' });
        }

        const storedOtp = results[0];

        if (new Date() > new Date(storedOtp.Reset_OTP_expiresAt)) {
          return res.status(400).json({ error: 'OTP expired' });
        }

        if (otp.toString().trim() !== storedOtp.Reset_otp.toString().trim()) {
          return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Mark OTP as verified
        connection.query(
          'UPDATE password_reset_otps SET Reset_OTP_verified = TRUE WHERE Reset_OTP_email = ?',
          [email],
          (updateErr) => {
            if (updateErr) {
              console.error('Error marking reset OTP verified:', updateErr);
              return res.status(500).json({ error: 'Server error marking OTP verified' });
            }

            // Allow user to proceed with password reset (response success)
            return res.json({ success: true });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error verifying reset password OTP:', error);
    res.status(500).json({ error: 'Server error verifying OTP' });
  }
});





{/*------------------------------------------------------------------------------------------------------------*/ }

//Setting up new password

// Endpoint to update password in signup and login tables
// Endpoint to update password in both signup and login tables
router.post('/update-password', (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  // Validate request
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Email, new password, and confirm password are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Update in signup table
  const updateSignupQuery = 'UPDATE signup SET password = ? WHERE email = ?';
  connection.query(updateSignupQuery, [newPassword, email], (err, result) => {
    if (err) {
      console.error('Error updating password in signup:', err);
      return res.status(500).json({ error: 'Server error updating signup password' });
    }

    // Update in login table
    const updateLoginQuery = 'UPDATE login SET login_password = ? WHERE login_email = ?';
    connection.query(updateLoginQuery, [newPassword, email], (loginErr, loginResult) => {
      if (loginErr) {
        console.error('Error updating password in login:', loginErr);
        return res.status(500).json({ error: 'Server error updating login password' });
      }

      return res.json({ success: true, message: 'Password updated successfully.' });
    });
  });
});



export default router;



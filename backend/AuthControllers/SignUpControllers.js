import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import supabase from '../db.js';

dotenv.config();

export const signupController = async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Signup Received body:", req.body);

  if (!name || name.length < 3) {
    return res.status(400).json({ error: 'Name must be at least 3 characters long.' });
  }
  if (!email || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  // Check if email is lowercase only
  if (email !== email.toLowerCase()) {
    return res.status(400).json({ error: 'Invalid email format (email must be lowercase)' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const now = new Date();
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST offset in ms
    const createdAtIST = new Date(now.getTime() + IST_OFFSET);

    // Insert user data into Supabase
    const { data, error } = await supabase
      .from('signup')
      .insert([
        { name, email, password, created_at: createdAtIST }
      ])
      .select();

    if (error) {
      console.error('Error inserting signup data:', error);
      let customMessage = 'Database error occurred. Please try again.';

      // Check for unique violation (email already exists)
      if (error.code === '23505') {
        customMessage = 'Email already exists.';
      } else if (error.code === '23502') {
        customMessage = 'Please fill in all required fields.';
      }

      return res.status(500).json({ error: customMessage });
    }

    const userId = data[0].id;

    // Automatically send OTP after successful signup
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        to: email,
        subject: "UniNotes - Verify Your Email",
        html: `<p>Welcome to <strong>UniNotes</strong></p><p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p><p>Do not share this OTP with anyone.</p>`,
      });

      const IST_OFFSET = 5.5 * 60 * 60 * 1000;
      const now = new Date();
      const createdAtIST = new Date(now.getTime() + IST_OFFSET);
      const expiresAtIST = new Date(
        now.getTime() + 5 * 60 * 1000 + IST_OFFSET
      );

      // Insert OTP into Supabase
      const { error: otpError } = await supabase
        .from('email_otps')
        .insert([
          { 
            otp_email: email, 
            otp: otp, 
            otp_createdat: createdAtIST, 
            otp_expiresat: expiresAtIST 
          }
        ]);

      if (otpError) {
        console.error("Error inserting OTP:", otpError);
        // Don't fail the signup if OTP fails, just log it
      }
    } catch (otpError) {
      console.error("Error sending OTP:", otpError);
      // Don't fail the signup if OTP fails, just log it
    }

    return res.status(201).json({ message: 'User signed up successfully', userId });
  } catch (err) {
    console.error('Unexpected error during signup:', err);
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
};
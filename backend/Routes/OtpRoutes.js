import express from "express";
import nodemailer from "nodemailer";
import supabase from "../db.js";
import {
  EmailOtpController,
  markOtpVerified,
} from "../AuthControllers/EmailOtpControllers.js";
const router = express.Router();

{
  /*------------------------------------------------------------------------------------------------------------*/
}

// Endpoint to send OTP to login
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

    // Count OTPs in last 6 hours
    const {
      data: countData,
      error: countError,
      count,
    } = await supabase
      .from("email_otps")
      .select("otp_id", { count: "exact", head: true })
      .gte("otp_createdat", sixHoursAgo)
      .eq("otp_email", email);

    if (countError) {
      console.error("Error counting OTPs:", countError);
      return res.status(500).json({ error: "Server error" });
    }

    if (count >= 3) {
      return res.status(429).json({ error: "Exceeded OTP limit" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      to: email,
      subject: "UniNotes",
      html: `<p>Welcome to <strong>UniNotes</strong></p><p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p><p>Do not share this OTP with anyone.</p>`,
    });

    const now = new Date();
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds

    const createdAtIST = new Date(now.getTime() + IST_OFFSET).toISOString();
    const expiresAtIST = new Date(
      now.getTime() + 5 * 60 * 1000 + IST_OFFSET
    ).toISOString();

    const { error: insertError } = await supabase.from("email_otps").insert([
      {
        otp_email: email,
        otp,
        otp_createdat: createdAtIST,
        otp_expiresat: expiresAtIST,
      },
    ]);

    if (insertError) {
      console.error("Error saving OTP:", insertError);
      return res.status(500).json({ error: "Error saving OTP" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Error in send-otp:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Endpoint to verify OTP to login

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP required" });
  }

  try {
    const storedOtp = await EmailOtpController(email);

    if (!storedOtp) return res.status(400).json({ error: "No OTP found" });

    const now = Date.now();
    const expires = new Date(storedOtp.otp_expiresat).getTime();

    if (now > expires) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (otp.toString().trim() !== storedOtp.otp.toString().trim()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await markOtpVerified(email);

    const { data: signupData, error: signupError } = await supabase
      .from("signup")
      .select("id, name, password, created_at")
      .eq("email", email)
      .limit(1);

    if (signupError || !signupData || signupData.length === 0) {
      return res
        .status(400)
        .json({ error: "User not found for login creation" });
    }
    
    const user = signupData[0];
    const signupCreatedAt = user.created_at;
    const password = user.password;

    // Insert login entry with created_at copied from signup.created_at
    const { error: loginError } = await supabase.from("login").insert([
      {
        login_email: email,
        login_password: password,
        created_at: signupCreatedAt,
      },
    ]);

    if (loginError) {
      return res.status(500).json({ error: "Failed to create login data" });
    }

    // Return user info along with success
    return res.json({ success: true, userId: user.id, userName: user.name });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Server error verifying OTP" });
  }
});


{
  /*------------------------------------------------------------------------------------------------------------*/
}
// Endpoint to check if email is registered to reset password
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  try {
    const { data, error } = await supabase
      .from("signup")
      .select("email")
      .eq("email", email)
      .limit(1);

    if (error) {
      console.error("Error checking email existence:", error);
      return res.status(500).json({ error: "Server error" });
    }

    return res.json({ exists: data.length > 0 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

//endpoint to send otp to reset password
//endpoint to send otp to reset password
router.post("/send-resetpassword-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {
    // Check if email exists in signup
    const { data: emailData, error: emailError } = await supabase
      .from("signup")
      .select("email")
      .eq("email", email)
      .limit(1);

    if (emailError) {
      console.error(
        "Error checking email before sending reset OTP:",
        emailError
      );
      return res.status(500).json({ error: "Server error" });
    }
    if (!emailData.length) {
      return res.status(400).json({ error: "Email not registered" });
    }

    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

    // Count reset OTPs sent in last 6 hours
    const {
      data: otpData,
      error: otpError,
      count,
    } = await supabase
      .from("password_reset_otps")
      .select("reset_otp_id", { count: "exact", head: true })
      .gte("reset_otp_createdat", sixHoursAgo)
      .eq("reset_otp_email", email);

    if (otpError) {
      console.error("Error counting reset OTPs:", otpError);
      return res.status(500).json({ error: "Server error" });
    }

    if (count >= 3) {
      return res.status(429).json({ error: "Exceeded OTP limit" });
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

    await transporter.sendMail({
      to: email,
      subject: "UniNotes Password Reset",
      html: `<p>Welcome to <strong>UniNotes</strong></p>
             <p>You requested to reset your UniNotes password.</p>
             <p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>
             <p>Do not share this OTP with anyone.</p>`,
    });

    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    const now = new Date();
    const createdAtIST = new Date(now.getTime() + IST_OFFSET).toISOString();
    const expiresAt = new Date(
      now.getTime() + 5 * 60 * 1000 + IST_OFFSET
    ).toISOString();

    // Insert reset OTP entry with IST timestamps
    const { error: insertError } = await supabase
      .from("password_reset_otps")
      .insert([
        {
          reset_otp_email: email,
          reset_otp: otp,
          reset_otp_expiresat: expiresAt,
          reset_otp_createdat: createdAtIST,
        },
      ]);

    if (insertError) {
      console.error("Error saving reset OTP", insertError);
      return res.status(500).json({ error: "Error saving OTP" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Error in send-resetpassword-otp:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

//verification of password reset otp to reset password
router.post("/verify-resetpassword-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP required" });
  }

  try {
    const { data: results, error: fetchError } = await supabase
      .from("password_reset_otps")
      .select("*")
      .eq("reset_otp_email", email)
      .order("reset_otp_createdat", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching reset OTP:", fetchError);
      return res.status(500).json({ error: "Server error fetching OTP" });
    }

    if (!results || results.length === 0) {
      return res.status(400).json({ error: "No OTP found" });
    }

    const storedOtp = results[0];

    if (new Date() > new Date(storedOtp.reset_otp_expiresat)) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (otp.toString().trim() !== storedOtp.reset_otp.toString().trim()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const { error: updateError } = await supabase
      .from("password_reset_otps")
      .update({ reset_otp_verified: true })
      .eq("reset_otp_email", email);

    if (updateError) {
      console.error("Error marking reset OTP verified:", updateError);
      return res
        .status(500)
        .json({ error: "Server error marking OTP verified" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Error verifying reset password OTP:", err);
    return res.status(500).json({ error: "Server error verifying OTP" });
  }
});

{
  /*------------------------------------------------------------------------------------------------------------*/
}

//Setting up new password

// Endpoint to update password in signup and login tables
router.post("/update-password", async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({
        error: "Email, new password, and confirm password are required",
      });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Update in signup table
    const { error: signupError } = await supabase
      .from("signup")
      .update({ password: newPassword })
      .eq("email", email);

    if (signupError) {
      console.error("Error updating password in signup:", signupError);
      return res
        .status(500)
        .json({ error: "Server error updating signup password" });
    }

    // Update in login table
    const { error: loginError } = await supabase
      .from("login")
      .update({ login_password: newPassword })
      .eq("login_email", email);

    if (loginError) {
      console.error("Error updating password in login:", loginError);
      return res
        .status(500)
        .json({ error: "Server error updating login password" });
    }

    return res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("Unexpected error updating password:", err);
    return res.status(500).json({ error: "Server error updating password" });
  }
});

export default router;

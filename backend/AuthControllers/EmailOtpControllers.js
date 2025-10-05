import supabase from '../db.js';

// Get the most recent OTP for an email
export const EmailOtpController = async (email) => {
  try {
    const { data, error } = await supabase
      .from('email_otps')
      .select('*')
      .eq('otp_email', email)
      .order('otp_createdat', { ascending: false })
      .limit(1);

    if (error) {
      console.error("Supabase error:", error);
      return null;
    }

    return data[0] || null;
  } catch (error) {
    console.error("Error fetching OTP:", error);
    return null;
  }
};

// Mark an OTP as verified
export const markOtpVerified = async (email) => {
  try {
    const { error } = await supabase
      .from('email_otps')
      .update({ otp_verified: true })
      .eq('otp_email', email);

    if (error) {
      console.error("Supabase error:", error);
    }
  } catch (error) {
    console.error("Error marking OTP as verified:", error);
  }
};

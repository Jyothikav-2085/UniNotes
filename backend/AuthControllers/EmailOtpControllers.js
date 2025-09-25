import supabase from '../db.js';

// get OTP and expiration time from email_otps table for given email
export async function EmailOtpController(email) {
 const { data, error } = await supabase
  .from('email_otps')
  .select('otp, otp_expiresat')
  .eq('otp_email', email)
  .order('otp_createdat', { ascending: false })
  .limit(1);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }
  return data[0];
}


// mark OTP as verified for the most recent OTP of the email
export async function markOtpVerified(email) {
  const { data: recentOtp, error: fetchError } = await supabase
    .from('email_otps')
    .select('otp_expiresat')
    .eq('otp_email', email)
    .order('otp_createdat', { ascending: false })
    .limit(1);

  if (fetchError) {
    throw fetchError;
  }

  if (!recentOtp || recentOtp.length === 0) {
    return null;
  }

  const expiresAt = recentOtp[0].otp_expiresat;

  const { data, error } = await supabase
    .from('email_otps')
    .update({ otp_verified: true })
    .eq('otp_email', email)
    .eq('otp_expiresat', expiresAt);

  if (error) {
    throw error;
  }

  return data;
}

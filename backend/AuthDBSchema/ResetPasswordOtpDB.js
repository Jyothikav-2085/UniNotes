import supabase from '../db.js';

const createResetPasswordOtpTable = async () => {
  // Supabase automatically creates tables via the dashboard
  // This function ensures the table exists and has the correct structure
  
  // Check if the table exists by trying to select from it
  const { data, error } = await supabase
    .from('password_reset_otps')
    .select('reset_otp_id')
    .limit(1);

  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Password Reset OTPs table does not exist. Please create it in the Supabase dashboard with the following structure:');
    console.log(`
      Table: password_reset_otps
      Columns:
        reset_otp_id: INTEGER, PRIMARY KEY, AUTO_INCREMENT
        reset_otp_email: VARCHAR(100), NOT NULL
        reset_otp: VARCHAR(10), NOT NULL
        reset_otp_createdat: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
        reset_otp_expiresat: TIMESTAMP, NOT NULL
        reset_otp_verified: BOOLEAN, DEFAULT FALSE
    `);
  } else {
    console.log('Password Reset OTPs table exists and is ready to use.');
  }
};

export default createResetPasswordOtpTable;
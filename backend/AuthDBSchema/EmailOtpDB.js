import supabase from '../db.js';

const createEmailOtpTable = async () => {
  // Supabase automatically creates tables via the dashboard
  // This function ensures the table exists and has the correct structure
  
  // Check if the table exists by trying to select from it
  const { data, error } = await supabase
    .from('email_otps')
    .select('otp_id')
    .limit(1);

  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Email OTPs table does not exist. Please create it in the Supabase dashboard with the following structure:');
    console.log(`
      Table: email_otps
      Columns:
        otp_id: INTEGER, PRIMARY KEY, AUTO_INCREMENT
        otp_email: VARCHAR(100), NOT NULL
        otp: VARCHAR(10), NOT NULL
        otp_createdat: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
        otp_expiresat: TIMESTAMP, NOT NULL
        otp_verified: BOOLEAN, DEFAULT FALSE
    `);
  } else {
    console.log('Email OTPs table exists and is ready to use.');
  }
};

export default createEmailOtpTable;
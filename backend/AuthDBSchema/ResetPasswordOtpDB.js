import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false }, 
});


const createResetPasswordOtpTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS password_reset_otps (
      reset_otp_id SERIAL PRIMARY KEY,
      reset_otp_email VARCHAR(100) NOT NULL,
      reset_otp VARCHAR(6) NOT NULL,
      reset_otp_expiresat TIMESTAMP NOT NULL,
      reset_otp_verified BOOLEAN DEFAULT FALSE,
      reset_otp_createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await client.connect();
    await client.query(createTableQuery);
    console.log('password_reset_otps table created.');
  } catch (err) {
    console.error('Error creating password_reset_otps table:', err);
  } finally {
    await client.end();
  }
};

export default createResetPasswordOtpTable;

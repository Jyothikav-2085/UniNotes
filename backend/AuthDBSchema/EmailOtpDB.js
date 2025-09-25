import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});


const createEmailOtpTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS email_otps (
      otp_id SERIAL PRIMARY KEY,
  otp_email VARCHAR(100) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  otp_createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  otp_verified BOOLEAN DEFAULT FALSE,
   otp_expiresat TIMESTAMP NOT NULL
    );
  `;

  try {
    await client.connect();
    await client.query(createTableQuery);
    console.log('email_otps table created.');
  } catch (err) {
    console.error('Error creating email_otps table:', err);
  } finally {
    await client.end();
  }
};

export default createEmailOtpTable;

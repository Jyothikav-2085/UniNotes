import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

const createLogInTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS login (
      login_id SERIAL PRIMARY KEY,
      login_email VARCHAR(100) NOT NULL UNIQUE,
      login_password VARCHAR(255) NOT NULL,
      last_login TIMESTAMP NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await client.connect();
    await client.query(createTableQuery);
    console.log('LogIn Table created.');
  } catch (err) {
    console.error('Error creating login table:', err);
  } finally {
    await client.end();
  }
};

export default createLogInTable;

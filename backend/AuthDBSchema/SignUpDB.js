import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },  
});

const createSignUpTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS signup (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await client.connect();
    await client.query(createTableQuery);
    console.log('SignUp Table created.');
  } catch (err) {
    console.error('Error creating signup table:', err);
  } finally {
    await client.end();
  }
};

export default createSignUpTable;

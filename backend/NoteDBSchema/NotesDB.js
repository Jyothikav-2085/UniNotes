import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

const createNotesInfoTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS notes_info (
      sl_no SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES signup(id) ON DELETE CASCADE,
      user_name VARCHAR(100) NOT NULL,
      department VARCHAR(100) NOT NULL,
      semester VARCHAR(50) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      unit VARCHAR(50) NOT NULL,
      note_title VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await client.connect();
    await client.query(createTableQuery);
    console.log('notes_info Table created.');
  } catch (err) {
    console.error('Error creating notes_info table:', err);
  } finally {
    await client.end();
  }
};

export default createNotesInfoTable;

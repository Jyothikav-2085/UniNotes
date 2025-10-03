import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

const createNotesTable = async () => {
  try {
    await client.connect();

    await client.query(`
      DO $$
      BEGIN
        ALTER TABLE signup ALTER COLUMN id TYPE BIGINT;
      EXCEPTION
        WHEN others THEN RAISE NOTICE 'signup.id might already be BIGINT.';
      END;
      $$;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notes_info (
        sl_no SERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES signup(id) ON DELETE CASCADE,
        user_name VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        semester VARCHAR(50) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        note_title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('notes_info table created.');
  } catch (err) {
    console.error('Database setup error:', err);
  } finally {
    await client.end();
  }
};

export default createNotesTable;

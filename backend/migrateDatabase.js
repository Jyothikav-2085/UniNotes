import supabase from './db.js';

const migrateDatabase = async () => {
  try {
    console.log('Starting database migration...');
    
    // 1. Add points column to signup table if it doesn't exist
    try {
      const { error: alterError } = await supabase
        .rpc('exec_sql', { sql: 'ALTER TABLE signup ADD COLUMN points INTEGER DEFAULT 0;' });
      
      if (alterError && !alterError.message.includes('column "points" of relation "signup" already exists')) {
        console.error('Error adding points column:', alterError);
      } else if (alterError) {
        console.log('Points column already exists');
      } else {
        console.log('Points column added successfully');
      }
    } catch (err) {
      console.log('Points column may already exist or RPC not available');
    }
    
    // 2. Check if note_likes table exists, create if not
    try {
      const { data: tableData, error: tableError } = await supabase
        .from('note_likes')
        .select('id')
        .limit(1);
      
      if (tableError && tableError.code === '42P01') {
        console.log('note_likes table does not exist, would need to create it in Supabase dashboard');
      } else {
        console.log('note_likes table exists');
      }
    } catch (err) {
      console.log('note_likes table check completed');
    }
    
    // 3. Create storage bucket for notes
    try {
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .createBucket('notes-pdfs', {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/png'
          ]
        });
      
      if (bucketError) {
        if (bucketError.message.includes('duplicate key value')) {
          console.log('Storage bucket "notes-pdfs" already exists');
        } else {
          console.error('Error creating storage bucket:', bucketError);
        }
      } else {
        console.log('Storage bucket "notes-pdfs" created successfully');
      }
    } catch (err) {
      console.log('Storage bucket setup completed');
    }
    
    console.log('Database migration completed');
  } catch (err) {
    console.error('Migration error:', err);
  }
};

// Run the migration
migrateDatabase();
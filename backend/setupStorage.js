import supabase from './db.js';

const setupStorage = async () => {
  try {
    // Create a storage bucket for notes
    const { data, error } = await supabase
      .storage
      .createBucket('notes-pdfs', {
        public: true,
        fileSizeLimit: 52428800, // 50MB limit
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

    if (error) {
      if (error.message.includes('duplicate key value')) {
        console.log('Storage bucket "notes" already exists');
      } else {
        console.error('Error creating storage bucket:', error);
      }
    } else {
      console.log('Storage bucket "notes" created successfully:', data);
    }

    // Set bucket to public
    const { error: policyError } = await supabase
      .storage
      .updateBucket('notes-pdfs', {
        public: true
      });

    if (policyError) {
      console.error('Error updating bucket policy:', policyError);
    } else {
      console.log('Bucket policy updated successfully');
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

// Run the setup
setupStorage();
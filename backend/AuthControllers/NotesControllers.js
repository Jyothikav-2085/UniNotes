import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const upload = multer({ storage: multer.memoryStorage() });

export const uploadNote = async (req, res) => {
  upload.single('note')(req, res, async (err) => {
    console.log('File upload request received.');
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      console.error('No file received from upload.');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    console.log('File received:', req.file.originalname);
    const { originalname, buffer, mimetype } = req.file;
    const { user_id, title } = req.body; // Changed title_subject to title
    // console.log('Request body - user_id:', user_id, 'title:', title); // Removed this console.log

    if (!user_id) {
      console.error('User ID missing in request body.');
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Use user-provided title as filename, with fallback to original name + extension
    const fileExtension = originalname.split('.').pop();
    const sanitizedTitle = title ? title.replace(/[^a-z0-9]/gi, '_') : originalname.split('.').slice(0, -1).join('_');
    const fileName = `${sanitizedTitle}.${fileExtension}`; // Removed user_id prefix
    const filePath = `notes-pdfs/${fileName}`;

    console.log('Attempting to upload to Supabase storage with filePath:', filePath);
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('notes-pdfs')
        .upload(filePath, buffer, { contentType: mimetype });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        return res.status(500).json({ success: false, message: 'Failed to upload file to Supabase.', error: uploadError.message });
      }

      console.log('Supabase upload successful. Upload data:', uploadData);
      const publicUrl = supabase.storage.from('notes-pdfs').getPublicUrl(filePath).data.publicUrl;
      console.log('Generated public URL:', publicUrl);

      // Removed metadata insertion into the 'notes' table
      // console.log('Attempting to insert metadata into Supabase notes table.');
      // const { data: insertData, error: insertError } = await supabase
      //   .from('notes')
      //   .insert([
      //     {
      //       user_id: user_id,
      //       file_url: publicUrl,
      //       title: title_subject || null,
      //       content: "",
      //       created_at: new Date().toISOString(),
      //     },
      //   ]);

      // if (insertError) {
      //   console.error('Supabase insert error:', insertError);
      //   return res.status(500).json({ success: false, message: 'Failed to save note metadata.', error: insertError.message });
      // }

      // console.log('Supabase metadata insertion successful. Insert data:', insertData);
      res.status(200).json({ success: true, message: 'Note uploaded successfully!', file_url: publicUrl });
    } catch (error) {
      console.error('Unexpected error during Supabase operation:', error);
      res.status(500).json({ success: false, message: 'An unexpected error occurred.', error: error.message });
    }
  });
};

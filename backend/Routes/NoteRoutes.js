import express from 'express';
import multer from 'multer';
import supabase from '../db.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('note'), async (req, res) => {
  try {
    const file = req.file;
    const {
      user_id,
      user_name,
      department,
      semester,
      subject,
      unit,
      title: note_title,
    } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (
      !user_id ||
      !user_name ||
      !department ||
      !semester ||
      !subject ||
      !unit ||
      !note_title
    ) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Generate a unique filename
    const fileName = `${user_id}_${Date.now()}_${file.originalname}`;

    // Upload file buffer to Supabase Storage bucket 'notes-pdfs'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('notes-pdfs')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error('Error uploading file to storage:', uploadError);
      return res.status(500).json({ error: 'File upload failed.' });
    }

    // Calculate IST timestamp for created_at
    const now = new Date();
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in ms
    const createdAtIST = new Date(now.getTime() + IST_OFFSET).toISOString();

    // Save notes metadata to the database including created_at in IST
    const { data, error } = await supabase
      .from('notes_info')
      .insert([
        {
          user_id,
          user_name,
          department,
          semester,
          subject,
          unit,
          note_title: note_title.trim(),
          created_at: createdAtIST,  // explicit IST timestamp
        },
      ]);

    if (error) {
      console.error('Error saving notes info:', error);
      return res.status(500).json({ error: 'Saving note info failed.' });
    }

    if (!data || data.length === 0) {
      console.error('No data returned after note insertion');
      return res.status(500).json({ error: 'No data returned from DB after inserting note info' });
    }

    return res.status(201).json({
      message: 'Note uploaded and info saved successfully.',
      noteInfo: data[0],
      publicUrl: supabase.storage.from('notes-pdfs').getPublicUrl(fileName).data.publicUrl,
    });
  } catch (err) {
    console.error('Unexpected error in /notes/upload:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;

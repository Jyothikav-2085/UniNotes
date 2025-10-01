export const notesController = async (req, res, supabase) => {
  try {
    const file = req.file; // multer stores uploaded file here
    const {
      user_id,
      user_name,
      department,
      semester,
      subject,
      unit,
      note_title
    } = req.body;

    console.log("Notes Upload Received body:", req.body);

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    if (!user_name || user_name.length < 3) {
      return res.status(400).json({ error: 'User name must be at least 3 characters long.' });
    }
    if (!department) {
      return res.status(400).json({ error: 'Department is required.' });
    }
    if (!semester) {
      return res.status(400).json({ error: 'Semester is required.' });
    }
    if (!subject) {
      return res.status(400).json({ error: 'Subject is required.' });
    }
    if (!unit) {
      return res.status(400).json({ error: 'Unit is required.' });
    }
    if (!note_title || note_title.trim().length === 0) {
      return res.status(400).json({ error: 'Note title is required.' });
    }

    // Generate unique file name
    const uniqueFileName = `${user_id}_${Date.now()}_${file.originalname}`;

    // Upload file buffer to Supabase Storage bucket 'notes-pdfs'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('notes-pdfs')
      .upload(uniqueFileName, file.buffer, { contentType: file.mimetype });

    if (uploadError) {
      console.error('File upload failed:', uploadError);
      return res.status(500).json({ error: 'File upload failed.' });
    }

    // Store metadata in database
    const { data, error } = await supabase
      .from('notes_info')
      .insert([{
        user_id,
        user_name,
        department,
        semester,
        subject,
        unit,
        note_title: note_title.trim()
      }]);

    console.log('Insert error:', error);
    console.log('Insert data:', data);

    if (error) {
      console.error('Error inserting note info:', error);
      return res.status(500).json({ error: 'Database error occurred. Please try again.' });
    }

    if (!data || data.length === 0) {
      console.error('No data returned after note insertion');
      return res.status(500).json({ error: 'No data returned from DB after inserting note info' });
    }

    return res.status(201).json({ message: 'Note uploaded and info saved successfully', noteInfo: data[0] });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
};

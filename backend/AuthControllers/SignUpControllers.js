export const signupController = async (req, res, supabase) => {
  const { name, email, password } = req.body;

  console.log("Signup Received body:", req.body);

  if (!name || name.length < 3) {
    return res.status(400).json({ error: 'Name must be at least 3 characters long.' });
  }
  if (!email || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  // Check if email is lowercase only
  if (email !== email.toLowerCase()) {
    return res.status(400).json({ error: 'Invalid email format (email must be lowercase)' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const now = new Date();
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST offset in ms
    const createdAtIST = new Date(now.getTime() + IST_OFFSET).toISOString();

    const { data, error } = await supabase
      .from('signup')
      .insert([{ name, email, password, created_at: createdAtIST }]);

    if (error) {
      console.error('Error inserting signup data:', error);
      let customMessage = 'Database error occurred. Please try again.';

      // PostgreSQL unique violation code for duplicates
      if (error.code === '23505') {
        customMessage = 'Email already exists.';
      } else if (error.code === '23502') {
        customMessage = 'Please fill in all required fields.';
      }

      return res.status(500).json({ error: customMessage });
    }

    const userId = data && data.length > 0 ? data[0].id || null : null;

    return res.status(201).json({ message: 'User signed up successfully', userId });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
};

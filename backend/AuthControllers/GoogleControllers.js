export const googleController = async (req, res, supabase) => {
  const { name, email, google_id, avatar } = req.body;

  try {
    // Calculate IST timestamp explicitly
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    const now = new Date();
    const createdAtIST = new Date(now.getTime() + IST_OFFSET).toISOString();

    // Insert into signup table with created_at in IST
    const { error: signupError } = await supabase
      .from('signup')
      .insert([{ 
        name, 
        email, 
        password: google_id,
        created_at: createdAtIST  // explicitly store IST timestamp
      }]);

    // Ignore duplicate key error (user already exists)
    if (signupError && signupError.code !== '23505') {
      return res.status(500).json({ error: 'Signup DB error', details: signupError });
    }

    // Insert into login table with created_at in IST
    const { error: loginError } = await supabase
      .from('login')
      .insert([{ 
        login_email: email, 
        login_password: google_id, 
        created_at: createdAtIST  // explicitly store IST timestamp
      }]);

    if (loginError && loginError.code !== '23505') {
      return res.status(500).json({ error: 'Login DB error', details: loginError });
    }

    return res.status(201).json({ message: 'Google user saved to both tables', google_id: google_id });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
};

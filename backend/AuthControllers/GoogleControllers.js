export const googleController = async (req, res, supabase) => {
  const { name, email, google_id, avatar } = req.body;

  try {

    
    // Insert into signup table
    const { error: signupError } = await supabase
      .from('signup')
      .insert([{ name, email, password: google_id }]);

    if (signupError && signupError.code !== '23505') { // 23505 is Postgres unique violation, equivalent of ER_DUP_ENTRY
      return res.status(500).json({ error: 'Signup DB error', details: signupError });
    }


    // Insert into login table
    const { error: loginError } = await supabase
      .from('login')
      .insert([{ login_email: email, login_password: google_id }]);

    if (loginError && loginError.code !== '23505') {
      return res.status(500).json({ error: 'Login DB error', details: loginError });
    }

    return res.status(201).json({ message: 'Google user saved to both tables', google_id: google_id });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
};

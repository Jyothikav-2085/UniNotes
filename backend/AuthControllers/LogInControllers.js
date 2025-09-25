export const loginController = async (req, res, DBsupabase) => {
  const { loginEmail, loginPassword } = req.body;

  console.log("Login request body:", req.body);

  if (!loginEmail || !/\S+@\S+\.\S+/.test(loginEmail)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  if (!loginPassword || loginPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const { data: results, error: selectError } = await DBsupabase
      .from('login')
      .select('*')
      .eq('login_email', loginEmail)
      .eq('login_password', loginPassword)
      .limit(1);

    if (selectError) {
      console.error('Login query error:', selectError);
      return res.status(500).json({ error: 'Database error occurred. Please try again.' });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const loginId = results[0].login_id;

    // IST offset in milliseconds
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    const now = new Date();

    // Calculate IST timestamps
    const lastLoginIST = new Date(now.getTime() + IST_OFFSET).toISOString();

    // Update last_login in IST
    const { error: updateError } = await DBsupabase
      .from('login')
      .update({ last_login: lastLoginIST })
      .eq('login_id', loginId);

    if (updateError) {
      console.error('Error updating last_login:', updateError);
    }

    // If login record does not have created_at, optionally insert here with IST timestamp.
    // Usually created_at is set on initial insert/signup, but if needed:
    
    const createdAtIST = new Date(now.getTime() + IST_OFFSET).toISOString();
    const { error: updateCreatedAtError } = await DBsupabase
      .from('login')
      .update({ created_at: createdAtIST })
      .eq('login_id', loginId);
    if (updateCreatedAtError) {
      console.error('Error updating created_at:', updateCreatedAtError);
    }
    

    return res.status(200).json({ message: 'Login successful', loginId });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
};

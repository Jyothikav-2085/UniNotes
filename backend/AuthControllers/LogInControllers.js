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
    // Verify credentials from login table
    const { data: loginResults, error: loginError } = await DBsupabase
      .from('login')
      .select('*')
      .eq('login_email', loginEmail)
      .eq('login_password', loginPassword)
      .limit(1);

    if (loginError) {
      console.error('Login query error:', loginError);
      return res.status(500).json({ error: 'Database error occurred. Please try again.' });
    }

    if (!loginResults || loginResults.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const loginId = loginResults[0].login_id;

    // Get user info from signup table by email
    const { data: userData, error: userError } = await DBsupabase
      .from('signup')
      .select('id, name')
      .eq('email', loginEmail)
      .limit(1)
      .single();

    if (userError) {
      console.error('Error fetching user info:', userError);
      return res.status(500).json({ error: 'Unable to fetch user info.' });
    }

    if (!userData) {
      return res.status(404).json({ error: 'User not found in signup table.' });
    }

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

    // Return userId and userName for frontend to store as logged in user info
    return res.status(200).json({
      message: 'Login successful',
      userId: userData.id,
      userName: userData.name,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
};

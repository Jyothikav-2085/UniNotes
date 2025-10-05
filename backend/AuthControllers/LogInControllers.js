import supabase from '../db.js';

export const loginController = async (req, res) => {
  const { loginEmail, loginPassword } = req.body;

  if (!loginEmail || !loginPassword) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Check if user exists in signup table
    const { data: signupData, error: signupError } = await supabase
      .from('signup')
      .select('id, name, password')
      .eq('email', loginEmail);

    if (signupError) {
      console.error('Supabase error:', signupError);
      return res.status(500).json({ error: 'Database error occurred.' });
    }

    if (signupData.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = signupData[0];

    // Verify password
    if (user.password !== loginPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Get created_at from signup table
    const { data: createdAtData, error: createdAtError } = await supabase
      .from('signup')
      .select('created_at')
      .eq('id', user.id);

    if (createdAtError) {
      console.error('Supabase error:', createdAtError);
      return res.status(500).json({ error: 'Database error occurred.' });
    }

    const createdAt = createdAtData[0].created_at;

    // Check if login entry already exists
    const { data: existingLoginData, error: existingLoginError } = await supabase
      .from('login')
      .select('id')
      .eq('login_email', loginEmail);

    if (existingLoginError) {
      console.error('Supabase error:', existingLoginError);
      return res.status(500).json({ error: 'Database error occurred.' });
    }

    let loginError;
    
    if (existingLoginData.length > 0) {
      // Update existing login entry
      const { error: updateError } = await supabase
        .from('login')
        .update({ 
          login_password: loginPassword, 
          created_at: createdAt 
        })
        .eq('login_email', loginEmail);
      
      loginError = updateError;
    } else {
      // Insert new login entry
      const { error: insertError } = await supabase
        .from('login')
        .insert([
          { login_email: loginEmail, login_password: loginPassword, created_at: createdAt }
        ]);
      
      loginError = insertError;
    }

    if (loginError) {
      console.error('Supabase error:', loginError);
      return res.status(500).json({ error: 'Database error occurred.' });
    }

    return res.status(200).json({
      message: 'Login successful',
      userId: user.id,
      userName: user.name,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Unexpected error during login.' });
  }
};

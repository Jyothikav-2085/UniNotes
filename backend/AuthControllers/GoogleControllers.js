import supabase from '../db.js';

export const googleController = async (req, res) => {
  console.log('=== GOOGLE AUTH CONTROLLER STARTED ===');
  console.log('Request received at:', new Date().toISOString());
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  
  const { name, email, google_id, avatar } = req.body;
  
  // Validate required fields
  if (!email || !google_id) {
    console.log('Missing required fields:', { email, google_id });
    return res.status(400).json({ 
      error: "Missing required fields", 
      details: "Email and google_id are required" 
    });
  }

  console.log('Processing Google auth for user:', { name, email });

  try {
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    const now = new Date();
    const createdAtIST = new Date(now.getTime() + IST_OFFSET);
    
    console.log('Current time (IST):', createdAtIST.toISOString());

    // Check if user already exists
    console.log('Checking if user exists in signup table...');
    const { data: checkData, error: checkError } = await supabase
      .from('signup')
      .select('id, name')
      .eq('email', email);

    if (checkError) {
      console.error("Supabase error when checking user:", checkError);
      return res.status(500).json({ error: "Database error", details: checkError.message });
    }
    
    console.log('User check result:', { 
      foundUsers: checkData.length, 
      userData: checkData 
    });

    let userId;

    if (checkData.length > 0) {
      // User already exists, update their info if needed
      console.log('User exists, updating information...');
      userId = checkData[0].id;
      
      const { error: updateError } = await supabase
        .from('signup')
        .update({ name: name || checkData[0].name, password: google_id })
        .eq('id', userId);

      if (updateError) {
        console.error("Supabase error when updating user:", updateError);
        return res.status(500).json({ error: "Database error", details: updateError.message });
      }
      
      console.log('User updated successfully');
    } else {
      // New user, insert into signup table
      console.log('New user, inserting into signup table...');
      const { data: insertData, error: insertError } = await supabase
        .from('signup')
        .insert([
          { name, email, password: google_id, created_at: createdAtIST }
        ])
        .select();

      if (insertError) {
        console.error("Supabase error when inserting new user:", insertError);
        return res.status(500).json({ error: "Database error", details: insertError.message });
      }

      userId = insertData[0].id;
      console.log('New user inserted successfully with ID:', userId);
    }

    // Create or update login entry
    console.log('Updating login table...');
    const { data: loginCheckData, error: loginCheckError } = await supabase
      .from('login')
      .select('id')
      .eq('login_email', email);

    if (loginCheckError) {
      console.error("Supabase error when checking login:", loginCheckError);
      return res.status(500).json({ error: "Database error", details: loginCheckError.message });
    }
    
    console.log('Login check result:', { 
      foundLogins: loginCheckData.length, 
      loginData: loginCheckData 
    });

    if (loginCheckData.length > 0) {
      // Update existing login entry
      console.log('Login entry exists, updating...');
      const { error: updateLoginError } = await supabase
        .from('login')
        .update({ login_password: google_id, created_at: createdAtIST })
        .eq('login_email', email);

      if (updateLoginError) {
        console.error("Supabase error when updating login:", updateLoginError);
        return res.status(500).json({ error: "Database error", details: updateLoginError.message });
      }
      console.log('Login entry updated successfully');
    } else {
      // Create new login entry
      console.log('New login entry, inserting...');
      const { error: insertLoginError } = await supabase
        .from('login')
        .insert([
          { login_email: email, login_password: google_id, created_at: createdAtIST }
        ]);

      if (insertLoginError) {
        console.error("Supabase error when inserting login:", insertLoginError);
        return res.status(500).json({ error: "Database error", details: insertLoginError.message });
      }
      console.log('Login entry inserted successfully');
    }

    console.log('Google authentication completed successfully for user:', email);
    return res.status(200).json({
      message: "Google authentication successful",
      userId: userId,
      userName: name,
      userEmail: email
    });
  } catch (err) {
    console.error("=== GOOGLE AUTH ERROR ===");
    console.error("Google auth error:", err);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    return res
      .status(500)
      .json({ error: "Unexpected error during Google authentication", details: err.message });
  } finally {
    console.log('=== GOOGLE AUTH CONTROLLER FINISHED ===');
  }
};
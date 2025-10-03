export const googleController = async (req, res, supabase) => {
  const { name, email, google_id, avatar } = req.body;

  try {
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    const now = new Date();
    const createdAtIST = new Date(now.getTime() + IST_OFFSET).toISOString();

    // Insert into signup table with created_at
    const { error: signupError } = await supabase.from("signup").insert([
      {
        name,
        email,
        password: google_id, // store google_id as password or another field as needed
        created_at: createdAtIST,
      },
    ]);

    if (signupError && signupError.code !== "23505") {
      return res
        .status(500)
        .json({ error: "Signup DB error", details: signupError });
    }

    // Fetch the correct signup.id and created_at
    const { data: userRows, error: fetchError } = await supabase
      .from("signup")
      .select("id, created_at")
      .eq("email", email)
      .single();

    if (fetchError || !userRows) {
      return res
        .status(401)
        .json({ error: "Signup lookup failed", details: fetchError });
    }

    // Insert corresponding login entry using signup data
    const { error: loginError } = await supabase.from("login").insert([
      {
        login_email: email,
        login_password: google_id, // or empty string if you don't want to store token here
        created_at: userRows.created_at,
      },
    ]);

    if (loginError) {
      return res
        .status(500)
        .json({ error: "Login DB error", details: loginError });
    }

    return res.status(201).json({
      message: "Google user saved in signup and login tables",
      signupId: userRows.id, // return the true signup id for frontend
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Unexpected error", details: err.message });
  }
};

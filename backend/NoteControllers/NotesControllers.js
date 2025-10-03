export const notesController = async (req, res, supabase) => {
  try {
    console.log("Received user_id in notes upload:", req.body.user_id);

    const file = req.file;
    const { user_id, department, semester, subject, unit, title } = req.body;

    if (!file) {
      console.error("No file uploaded.");
      return res.status(400).json({ error: "No file uploaded." });
    }

    if (!user_id) {
      console.error("User ID is required.");
      return res.status(400).json({ error: "User ID is required." });
    }

    if (typeof user_id !== 'string' || !/^\d+$/.test(user_id)) {
      console.error("Invalid user ID format:", user_id);
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const userIdNum = Number(user_id);
    if (!Number.isSafeInteger(userIdNum) || userIdNum < 1) {
      console.error("User ID is not a safe integer:", user_id);
      return res.status(400).json({ error: "Invalid user ID." });
    }

    // Fetch user_name from signup table by user_id
    const { data: userData, error: userError } = await supabase
      .from("signup")
      .select("name")
      .eq("id", userIdNum)
      .single();

    if (userError || !userData) {
      console.error("Failed to fetch user name from signup:", userError);
      return res.status(400).json({ error: "Invalid user ID, user not found." });
    }

    const user_name = userData.name;

    const uniqueFileName = `${user_id}_${Date.now()}_${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("notes-pdfs")
      .upload(uniqueFileName, file.buffer, { contentType: file.mimetype });

    if (uploadError) {
      console.error("File upload failed:", uploadError);
      return res.status(500).json({ error: "File upload failed." });
    }

    console.log(`File "${uniqueFileName}" uploaded successfully`);

    const nowUTC = new Date();
    const ISTOffsetInMs = (5 * 60 * 60 + 30 * 60) * 1000;
    const dateIST = new Date(nowUTC.getTime() + ISTOffsetInMs);

    const { data, error } = await supabase
      .from("notes_info")
      .insert([{
        user_id: userIdNum,
        user_name,
        department,
        semester,
        subject,
        unit,
        note_title: title.trim(),
        created_at: dateIST.toISOString(),
      }])
      .select();

    if (error) {
      console.error("Error saving note info:", error);
      return res.status(500).json({ error: "Saving note info failed." });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({ error: "No data returned after inserting note info" });
    }

    res.status(201).json({
      message: "Note uploaded and info saved successfully",
      noteInfo: data[0],
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error.", details: err.message });
  }
};

import supabase from '../db.js';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

export const notesController = async (req, res) => {
  try {
    console.log("Received user_id in notes upload:", req.body.user_id);

    const file = req.file;
    const { user_id, department, semester, subject, unit, title } = req.body;

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

    // Try to fetch user_name from signup table by user_id
    let user_name = "Unknown User"; // Default fallback
    let userExists = false;
    
    try {
      const { data, error } = await supabase
        .from('signup')
        .select('name, id')
        .eq('id', userIdNum);

      if (error) {
        console.error("Supabase error fetching user:", error);
      } else if (data.length > 0) {
        user_name = data[0].name;
        userExists = true;
        console.log(`Found user: ${user_name} with ID: ${userIdNum}`);
      } else {
        console.error(`User with ID ${userIdNum} not found in signup table`);
        return res.status(400).json({ error: `User with ID ${userIdNum} not found` });
      }
    } catch (fetchError) {
      console.error("Error fetching user name:", fetchError);
      return res.status(500).json({ error: "Error fetching user information" });
    }

    // Handle file upload to Supabase storage
    let fileUrl = null;
    let fileName = null;
    
    if (file) {
      // Create a unique file name
      fileName = `${userIdNum}_${Date.now()}_${file.originalname}`;
      
      // Upload file to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('notes-pdfs')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        console.error("Error uploading file to Supabase storage:", error);
        return res.status(500).json({ error: "Failed to upload file to storage" });
      }
      
      // Get public URL for the file
      const { data: { publicUrl } } = supabase
        .storage
        .from('notes-pdfs')
        .getPublicUrl(fileName);
      
      fileUrl = publicUrl;
    }

    console.log(`File processed successfully: ${fileName}`);

    const nowUTC = new Date();
    const ISTOffsetInMs = (5 * 60 * 60 + 30 * 60) * 1000;
    const dateIST = new Date(nowUTC.getTime() + ISTOffsetInMs);

    // First, verify that the user exists before inserting the note
    const { data: userData, error: userError } = await supabase
      .from('signup')
      .select('id')
      .eq('id', userIdNum);

    if (userError) {
      console.error("Error checking user existence:", userError);
      return res.status(500).json({ error: "Database error occurred while checking user" });
    }

    if (userData.length === 0) {
      return res.status(400).json({ error: `User with ID ${userIdNum} does not exist` });
    }

    const { data: insertData, error: insertError } = await supabase
      .from('notes_info')
      .insert([
        { 
          user_id: userIdNum, 
          user_name, 
          department, 
          semester, 
          subject, 
          unit, 
          note_title: title.trim(), 
          file_name: fileName, 
          created_at: dateIST  // Supabase will handle the ISO string conversion
        }
      ])
      .select();

    if (insertError) {
      console.error("Supabase error inserting note:", insertError);
      // Provide more specific error messages
      if (insertError.code === '23503') {
        return res.status(400).json({ 
          error: "Cannot upload note: User does not exist or foreign key constraint failed",
          details: insertError.message 
        });
      }
      return res.status(500).json({ 
        error: "Database error occurred while saving note information",
        details: insertError.message 
      });
    }

    if (insertData.length === 0) {
      return res.status(500).json({ error: "No data returned after inserting note info" });
    }

    // Add 10 points to the user for uploading a note
    try {
      const { data: pointsData, error: pointsError } = await supabase
        .from('signup')
        .select('points')
        .eq('id', userIdNum);

      if (pointsError) {
        console.error("Supabase error fetching points:", pointsError);
        // Continue without updating points if column doesn't exist
      } else if (pointsData.length > 0) {
        // Check if points column exists by checking if it's in the response
        if (pointsData[0].hasOwnProperty('points')) {
          const currentPoints = pointsData[0].points || 0;
          const newPoints = currentPoints + 10;

          const { error: updateError } = await supabase
            .from('signup')
            .update({ points: newPoints })
            .eq('id', userIdNum);

          if (updateError) {
            console.error("Supabase error updating points:", updateError);
            // Continue without updating points if there's an error
          } else {
            console.log(`User points updated: ${currentPoints} -> ${newPoints}`);
          }
        } else {
          console.log("Points column not found in signup table, skipping points update");
        }
      }
    } catch (pointsError) {
      console.error("Error updating user points:", pointsError);
      // Continue without updating points if there's an error
    }

    res.status(201).json({
      message: "Note uploaded and info saved successfully",
      noteInfo: insertData[0],
      fileUrl: fileUrl // Return file URL for download
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error.", details: err.message });
  }
};
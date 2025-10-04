import express from "express";
import multer from "multer";
import { notesController } from "../NoteControllers/NotesControllers.js";
import supabase from "../db.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload note
router.post("/upload", upload.single("note"), (req, res) => {
  notesController(req, res, supabase);
});

// Get notes by branch and semester
router.get("/", async (req, res) => {
  try {
    const { department, semester } = req.query;
    
    if (!department || !semester) {
      return res.status(400).json({ error: "Department and semester are required" });
    }

    const { data, error } = await supabase
      .from("notes_info")
      .select("*")
      .eq("department", department)
      .eq("semester", semester)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
      return res.status(500).json({ error: "Failed to fetch notes" });
    }

    res.json({ notes: data || [] });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

// Download note
router.get("/download/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;
    
    const { data, error } = await supabase.storage
      .from("notes-pdfs")
      .download(fileName);

    if (error) {
      console.error("Error downloading file:", error);
      return res.status(404).json({ error: "File not found" });
    }

    // Set appropriate headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Convert blob to buffer and send
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

export default router;

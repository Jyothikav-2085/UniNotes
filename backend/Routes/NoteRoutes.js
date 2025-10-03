import express from "express";
import multer from "multer";
import { notesController } from "../NoteControllers/NotesControllers.js";
import supabase from "../db.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("note"), (req, res) => {
  notesController(req, res, supabase);
});

export default router;

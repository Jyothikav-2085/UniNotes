import express from 'express';
import { uploadNote } from '../AuthControllers/NotesControllers.js';

const router = express.Router();

router.post('/upload', uploadNote);

export default router;

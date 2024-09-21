import express from 'express';
import { createNote, getNotes, editNote, shareNote } from '../Controllers/salesControllers.js';

const router = express.Router();

router.post('/notes', createNote);
router.get('/notes', getNotes);
router.put('/notes/:id', editNote);
router.post('/notes/:id/share', shareNote);

export default router;

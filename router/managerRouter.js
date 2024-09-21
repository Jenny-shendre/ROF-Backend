import express from 'express';
import { getAllTeams, getTeamsByManagerEmail } from '../Controllers/managerController.js';

const router = express.Router();

// Route to get teams by manager's name
router.post('/teams/manager/email', getTeamsByManagerEmail);

router.get('/teams', getAllTeams);

export default router;

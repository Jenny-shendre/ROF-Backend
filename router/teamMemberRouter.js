import express from 'express';
import {
    getAllTeamMembers,
    getAvailableTeamMembers,
    getAssignedTeamMembers
} from '../Controllers/teamMemberController.js';

const router = express.Router();

router.get('/fetch-all', getAllTeamMembers);
router.get('/fetch-available', getAvailableTeamMembers);
router.get('/fetch-assigned', getAssignedTeamMembers);

export default router;

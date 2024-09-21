import express from 'express';
import { getAllDetails, createDetails, getDetailsById, updateDetails, deleteDetails } from '../Controllers/detailsController.js';

const router = express.Router();

router.get('/', getAllDetails);
router.post('/', createDetails);
router.get('/:id', getDetailsById);
router.put('/:id', updateDetails);
router.delete('/:id', deleteDetails);

export default router;

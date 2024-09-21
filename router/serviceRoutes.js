console.log('Service routes loaded');

import express from 'express';
import { createService, deleteService, getServiceById, getServices, updateService } from '../Controllers/serviceController.js';

const router = express.Router();

router.post('/save', createService);
router.get('/fetch-all', getServices);
router.get('/fetch/:id', getServiceById);
router.put('/update/:id', updateService);
router.delete('/delete/:id', deleteService);

export default router;
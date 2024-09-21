import express from 'express';
const router = express.Router();
import {
  getAllRecords,
  getRecord,
  newRecord,
  updateRecord,
  deleteRecord 
} from '../Controllers/recordController.js';

router.get('/getAllRecords', getAllRecords);
router.get('/getRecordBy/:id', getRecord, (req, res) => res.json(res.record)); // Use the middleware and then send the response
router.post('/newRecord', newRecord);
router.put('/updateRecord/:id', updateRecord);
router.delete('/deleteRecord/:id', deleteRecord);

export default router;

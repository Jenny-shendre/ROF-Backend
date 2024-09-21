import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import Record from '../Models/Record.js';

// Get all records
export const getAllRecords = asyncHandler(async (req, res) => {
    try {
        const records = await Record.find();
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get record by ID
export const getRecord = asyncHandler(async (req, res, next) => {
    try {
        const record = await Record.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Cannot find record' });
        }
        res.record = record;
        next(); // Pass control to the next middleware or route handler
    } catch (err) {
        return res.status(500).json({ message: 'Error getting record' });
    }
});

// Create a new record
export const newRecord = asyncHandler(async (req, res) => {
    const record = new Record({
        channelPartnerName: req.body.channelPartnerName,
        channelPartnerCompanyName: req.body.channelPartnerCompanyName,
        customerName: req.body.customerName,
        customerMobileLastFour: req.body.customerMobileLastFour,
        projectName: req.body.projectName,
        projectLocation: req.body.projectLocation,
        partnerId: req.body.partnerId,
        attendant: req.body.attendant,
        attendantName: req.body.attendantName
    });

    try {
        const newRecord = await record.save();
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an existing record with specific fields
export const updateRecord = asyncHandler(async (req, res) => {
    let record;
    try {
        record = await Record.findById(req.params.id);
        if (record == null) {
            return res.status(404).json({ message: 'Cannot find record' });
        }

        // Update only specific fields
        if (req.body.customerName != null) {
            record.customerName = req.body.customerName;
        }
        if (req.body.channelPartnerCompanyName != null) {
            record.channelPartnerCompanyName = req.body.channelPartnerCompanyName;
        }
        if (req.body.customerMobileLastFour != null) {
            record.customerMobileLastFour = req.body.customerMobileLastFour;
        }

        record.updatedAt = Date.now();
        const updatedRecord = await record.save();
        res.json(updatedRecord);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a record
export const deleteRecord = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ObjectId' });
        }

        // Find the record and delete it
        const result = await Record.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.json({ message: 'Deleted Record' });
    } catch (err) {
        console.error('Error in delete route:', err); // Debugging line
        res.status(500).json({ message: 'Error occurred while deleting record' });
    }
});

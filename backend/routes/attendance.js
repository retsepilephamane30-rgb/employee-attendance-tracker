const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// GET all attendance records
router.get('/', (req, res) => {
  console.log('📨 GET request received for /api/attendance');
  
  Attendance.getAll((err, records) => {
    if (err) {
      console.error('❌ Database error:', err.message);
      return res.status(500).json({ 
        error: 'Failed to fetch attendance records',
        details: err.message 
      });
    }
    console.log(`✅ Sending ${records.length} records to frontend`);
    res.json(records);
  });
});

// POST new attendance record
router.post('/', (req, res) => {
  const { employeeName, employeeID, date, status } = req.body;

  // Validation
  if (!employeeName || !employeeID || !date || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['Present', 'Absent'].includes(status)) {
    return res.status(400).json({ error: 'Status must be Present or Absent' });
  }

  Attendance.create({ employeeName, employeeID, date, status }, (err, newRecord) => {
    if (err) {
      console.error('Error creating attendance:', err);
      return res.status(500).json({ error: 'Failed to create attendance record' });
    }
    res.status(201).json({ 
      message: 'Attendance recorded successfully',
      record: newRecord 
    });
  });
});

// DELETE attendance record
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Attendance.delete(id, (err, deletedCount) => {
    if (err) {
      console.error('Error deleting attendance:', err);
      return res.status(500).json({ error: 'Failed to delete attendance record' });
    }
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Attendance record deleted successfully' });
  });
});

// SEARCH attendance records
router.get('/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  Attendance.searchByNameOrID(q, (err, records) => {
    if (err) {
      console.error('Error searching attendance:', err);
      return res.status(500).json({ error: 'Failed to search attendance records' });
    }
    res.json(records);
  });
});

// FILTER attendance by date
router.get('/filter', (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({ error: 'Date is required for filtering' });
  }

  Attendance.filterByDate(date, (err, records) => {
    if (err) {
      console.error('Error filtering attendance:', err);
      return res.status(500).json({ error: 'Failed to filter attendance records' });
    }
    res.json(records);
  });
});

module.exports = router;
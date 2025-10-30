const express = require('express');
const router = express.Router();
const createConnection = require('../config/database');

// Helper function to get database connection
const getConnection = async () => {
  try {
    return await createConnection();
  } catch (error) {
    throw new Error('Database connection failed');
  }
};

// Get all attendance records
router.get('/', async (req, res) => {
  console.log('📨 GET request received for /api/attendance');
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT a.*, e.name, e.position, e.department 
      FROM attendance a 
      LEFT JOIN employees e ON a.employee_id = e.employee_id 
      ORDER BY a.created_at DESC
    `);
    
    console.log(`✅ Sending ${rows.length} records to frontend`);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching attendance:', error);
    res.status(500).json({ 
      error: 'Failed to fetch attendance records', 
      details: error.message 
    });
  }
});

// Add new attendance record
router.post('/', async (req, res) => {
  console.log('📨 POST request received for /api/attendance');
  try {
    const { employee_id, check_in, check_out, date, status, notes } = req.body;
    
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO attendance (employee_id, check_in, check_out, date, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_id, check_in, check_out, date, status, notes]
    );
    
    console.log('✅ Attendance record created with ID:', result.insertId);
    res.json({ message: 'Attendance record created successfully', id: result.insertId });
  } catch (error) {
    console.error('❌ Error creating attendance:', error);
    res.status(500).json({ error: 'Failed to create attendance record', details: error.message });
  }
});

// Make sure this is at the end of the file
module.exports = router;
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

// ... rest of your routes with similar connection handling
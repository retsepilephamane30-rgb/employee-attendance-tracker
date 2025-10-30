const mysql = require('mysql2');
require('dotenv').config();

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'attendance_tracker',
  port: process.env.DB_PORT || 3306
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('❌ ERROR connecting to MySQL:', err.message);
    console.error('💡 Please check:');
    console.error('   - Is MySQL service running?');
    console.error('   - Are the database credentials correct?');
    console.error('   - Does the database exist?');
  } else {
    console.log('✅ Connected to MySQL database successfully!');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employeeName VARCHAR(255) NOT NULL,
      employeeID VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      status ENUM('Present', 'Absent') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('✅ Attendance table ready.');
      
      // Check if table has data
      connection.query('SELECT COUNT(*) as count FROM attendance', (err, results) => {
        if (err) {
          console.error('Error checking data:', err.message);
        } else {
          const recordCount = results[0].count;
          console.log(`📊 Database has ${recordCount} records.`);
          
          if (recordCount === 0) {
            insertSampleData();
          }
        }
      });
    }
  });
}

function insertSampleData() {
  const insertQuery = `
    INSERT INTO attendance (employeeName, employeeID, date, status) VALUES
    ('MPHO', 'EMP001', CURDATE(), 'Present'),
    ('NEO', 'EMP002', CURDATE(), 'Present'),
    ('RETSEPILE', 'EMP003', CURDATE(), 'Absent'),
    ('MICHEAL', 'EMP004', CURDATE(), 'Present'),
    ('THABO', 'EMP005', CURDATE(), 'Present'),
    ('THABANG', 'EMP006', CURDATE(), 'Absent')
  `;
  
  connection.query(insertQuery, (err) => {
    if (err) {
      console.error('Error inserting sample data:', err.message);
    } else {
      console.log('✅ Sample data inserted successfully!');
    }
  });
}

module.exports = connection;
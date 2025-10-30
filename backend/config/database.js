const mysql = require('mysql2/promise');

let connection;

const createConnection = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      reconnect: true
    });

    console.log('✅ Connected to MySQL database successfully!');
    
    // Create tables if they don't exist
    await createTables();
    
    return connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // Retry connection after 5 seconds
    setTimeout(createConnection, 5000);
    throw error;
  }
};

const createTables = async () => {
  try {
    // Create employees table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        position VARCHAR(100),
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create attendance table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(20) NOT NULL,
        check_in TIMESTAMP NULL,
        check_out TIMESTAMP NULL,
        date DATE NOT NULL,
        total_hours DECIMAL(5,2) DEFAULT 0,
        status ENUM('present', 'absent', 'late', 'half-day') DEFAULT 'present',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables ready');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
};

// Handle connection errors
connection?.on('error', async (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconnecting to database...');
    await createConnection();
  } else {
    throw err;
  }
});

module.exports = createConnection;
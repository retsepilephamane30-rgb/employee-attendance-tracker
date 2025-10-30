require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./middleware/cors');
const attendanceRoutes = require('./routes/attendance');
require('./config/database'); // Initialize database

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/attendance', attendanceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Backend API available at: http://localhost:${PORT}/api/attendance`);
});
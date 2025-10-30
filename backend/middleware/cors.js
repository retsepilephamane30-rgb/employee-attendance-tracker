const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
};

module.exports = cors(corsOptions);
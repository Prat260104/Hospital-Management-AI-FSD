// Import dotenv and configure at the top of the file
require('dotenv').config();

// Import required modules
const express = require('express');
const connectDB = require('./config/db');
const patientRoutes = require('./routes/patientRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Create Express app
const app = express();

// Configure express.json() middleware for parsing JSON request bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hospital Patient Management API is running'
  });
});

// Mount patient routes at /patients
app.use('/patients', patientRoutes);

// Register error handling middleware (MUST be last in the middleware chain)
app.use(errorHandler);

// Get PORT from environment variables with default fallback
const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB()
  .then(() => {
    // Start server on specified port
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  });

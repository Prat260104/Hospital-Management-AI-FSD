// Global error handling middleware for the Hospital Patient Management API
// Handles Mongoose validation errors, cast errors, duplicate key errors, and generic errors

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = err.message || 'Internal Server Error';
  let errorDetails = {};

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    // Extract field-specific validation errors
    errorDetails = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  }

  // Handle Mongoose CastError (invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid patient ID format';
  }

  // Handle MongoDB duplicate key error (code 11000)
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Handle custom 404 errors
  else if (err.statusCode === 404) {
    statusCode = 404;
    message = err.message;
  }

  // Build error response
  const errorResponse = {
    success: false,
    message: message
  };

  // Include validation error details if present
  if (Object.keys(errorDetails).length > 0) {
    errorResponse.errors = errorDetails;
  }

  // Include error details in development mode
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error = err.message;
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = { errorHandler };

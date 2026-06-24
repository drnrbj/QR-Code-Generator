/**
 * Global Error Handler Middleware
 * Provides consistent error responses across the application
 */

/**
 * Handle Mongoose Validation Errors
 * @param {Error} err - Mongoose validation error
 * @returns {Object} Formatted error response
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(error => ({
    field: error.path,
    message: error.message
  }));

  return {
    statusCode: 400,
    message: 'Validation Error',
    error: 'VALIDATION_ERROR',
    details: errors
  };
};

/**
 * Handle Mongoose Duplicate Key Errors
 * @param {Error} err - Mongoose duplicate key error
 * @returns {Object} Formatted error response
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  return {
    statusCode: 409,
    message: `Duplicate value: ${value} already exists for field: ${field}`,
    error: 'DUPLICATE_KEY_ERROR',
    details: {
      field,
      value
    }
  };
};

/**
 * Handle Mongoose Cast Errors (Invalid ObjectId)
 * @param {Error} err - Mongoose cast error
 * @returns {Object} Formatted error response
 */
const handleCastError = (err) => {
  return {
    statusCode: 400,
    message: `Invalid ${err.path}: ${err.value}`,
    error: 'INVALID_ID_ERROR',
    details: {
      field: err.path,
      value: err.value
    }
  };
};

/**
 * Main Error Handler
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  console.error('💥 Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
    error: 'INTERNAL_ERROR'
  };

  // Handle specific Mongoose errors
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  } else if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  } else if (err.name === 'CastError') {
    error = handleCastError(err);
  }

  // Add stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    error: error.error,
    ...(error.details && { details: error.details }),
    ...(error.stack && { stack: error.stack })
  });
};

module.exports = errorHandler;
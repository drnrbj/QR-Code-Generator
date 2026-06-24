const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Connect to MongoDB database
connectDB();

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes will be added in Phase 2
// We'll import and use route files here

// Health check endpoint for API monitoring
app.get('/api/health', (req, res) => {
  const healthcheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  console.log('Health check requested:', healthcheck);
  res.status(200).json(healthcheck);
});

// Error handling middleware for 404 routes
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Define port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app; // Export for testing purposes
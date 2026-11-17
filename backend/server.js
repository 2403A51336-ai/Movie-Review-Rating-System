const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { connectDB, getDBStatus } = require('./config/db');
const { isConfigured } = require('./config/tmdb');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check and API status route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'CineReview API',
    databaseConnected: getDBStatus(),
    tmdbApiConfigured: isConfigured(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/watchlist', require('./routes/watchlistRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root greeting
app.get('/', (req, res) => {
  res.send('CineReview REST API Server is running. Access endpoints via /api/...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` CineReview Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Database: ${getDBStatus() ? 'Connected' : 'Connecting/Offline'}`);
  console.log(` TMDB API Key: ${isConfigured() ? 'Active (Live API)' : 'Not set (Curated Fallback Active)'}`);
  console.log(`===============================================`);
});

module.exports = app;

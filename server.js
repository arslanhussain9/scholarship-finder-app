const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Prevent browsers from caching HTML pages (always serve fresh code)
app.use((req, res, next) => {
  if (req.url.endsWith('.html') || req.url === '/') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// Expose public folder for static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));




// ── Mongoose connection (cached for Vercel serverless) ──────────────────────
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      dbName: 'scholarship-finder' 
    });
    isConnected = true;
    console.log('MongoDB Connected to scholarship-finder');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

// Ensure DB is connected for Vercel serverless functions before handling routes
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/scholarships', require('./routes/scholarships'));
app.use('/api/fetch', require('./routes/api-fetcher'));

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

// Export for Vercel serverless
module.exports = app;

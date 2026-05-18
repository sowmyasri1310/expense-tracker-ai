require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const transactionRoutes = require('./routes/transactions');
const debtRoutes = require('./routes/debts');
const ocrRoutes = require('./routes/ocr');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Use local DB if MONGO_URI is not provided in .env
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/ocr', ocrRoutes);

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log("⚠️ GEMINI_API_KEY not set or is default. OCR will run in MOCK mode.");
    }
  });
}

// Export the Express API for Vercel Serverless
module.exports = app;

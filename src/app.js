const express = require('express');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', quizRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('AI Quiz Backend is running');
});

module.exports = app;

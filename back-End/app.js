const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const machineRoutes = require('./routes/machineRoutes');
const operationRoutes = require('./routes/operationRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Validate MONGO_URI
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in environment variables');
  process.exit(1);
}
console.log('MONGO_URI:', process.env.MONGO_URI);

// Initialize Express app
const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Adjust for production if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Role'],
  credentials: true
}));
app.options('*', cors());

// Serve static files for uploads (e.g., machine images, incident attachments)
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/performances', performanceRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware (applied after all routes)
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const { cleanupAllDirectories } = require('./services/fileCleanup');

// Import routes
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problem');
const submissionRoutes = require("./routes/submission");
const codeRoutes = require("./routes/code");
// Create Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/code',codeRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Ensure temp directories exist
const ensureTempDirectories = async () => {
  // Use the same paths as in the services files
  const servicesDir = path.join(__dirname, "services");
  const dirCodes = path.join(servicesDir, "codes");
  const dirInputs = path.join(servicesDir, "inputs");
  const dirOutputs = path.join(servicesDir, "outputs");
  
  // Directories to ensure exist
  const directories = [dirCodes, dirInputs, dirOutputs];
  
  for (const dir of directories) {
    try {
      await fs.access(dir);
      console.log(`Directory exists: ${dir}`);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.mkdir(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      } else {
        console.error(`Error checking directory ${dir}:`, err);
      }
    }
  }
};

// Schedule periodic cleanup
const scheduleCleanup = () => {
  const ONE_HOUR = 1000 * 60 * 60;
  
  // Initial cleanup when server starts
  cleanupAllDirectories()
    .then(() => console.log('Initial cleanup completed'))
    .catch(err => console.error('Error during initial cleanup:', err));
    
  // Schedule regular cleanup every hour
  setInterval(() => {
    const maxAgeMs = ONE_HOUR * 24; // 24 hours old files
    cleanupAllDirectories(maxAgeMs)
      .then(() => console.log(`Scheduled cleanup completed at ${new Date().toISOString()}`))
      .catch(err => console.error('Error during scheduled cleanup:', err));
  }, ONE_HOUR);
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  // Ensure directories exist and start cleanup schedule
  ensureTempDirectories()
    .then(() => scheduleCleanup())
    .catch(err => console.error('Error setting up directories or cleanup:', err));
    
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
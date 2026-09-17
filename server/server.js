const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDb } = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const workloadRoutes = require('./routes/workloadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users/workload', workloadRoutes);
app.use('/api/users', userRoutes);

// Root & Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TaskFlow API service is online',
    timestamp: new Date()
  });
});

// Serve Frontend static production build if available
const path = require('path');
const fs = require('fs');
const clientBuildPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    if (!req.originalUrl.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    } else {
      res.status(404).json({ error: `Route ${req.originalUrl} not found` });
    }
  });
} else {
  // 404 Route Handler for API when client/dist not built
  app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });
}

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server and Initialize Database
async function startServer() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🚀 TaskFlow Backend Server running on http://localhost:${PORT}`);
  });
}

// Initialize DB on Vercel serverless load
initDb();

module.exports = app;

if (require.main === module || !process.env.VERCEL) {
  startServer();
}

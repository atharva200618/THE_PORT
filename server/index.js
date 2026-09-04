import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { UPLOADS_DIR } from './storage.js';
import healthRouter from './routes/health.js';
import workerRouter, { getLocalNetworkIp } from './routes/worker.js';
import jobsRouter from './routes/jobs.js';
import { startCleanupService } from './services/cleanup.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files if dist exists
const DIST_PATH = path.join(process.cwd(), 'dist');
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
}

// Root Status & Health Route
app.get('/', (req, res) => {
  const indexHtml = path.join(DIST_PATH, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  res.json({
    name: 'The Port API',
    status: 'online',
    version: '2.0.0',
    engine: 'Universal Apple iWork, Office & Media Passage Engine',
    endpoints: {
      health: '/api/health',
      convert: 'POST /api/convert',
      workerStatus: '/api/worker/status'
    }
  });
});

// Mount modular API routers
app.use('/api/health', healthRouter);
app.use('/api/worker', workerRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api', jobsRouter);

// Start background cleanup and keep-alive service
startCleanupService();

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================================`);
  console.log(` The Port — Backend API running on port ${PORT} (0.0.0.0)`);
  console.log(` Local Network IP: ${getLocalNetworkIp()}`);
  console.log(` Storage: ${UPLOADS_DIR}`);
  console.log(` Database: SQLite initialized`);
  console.log(` 24-Hour Auto-Expiration: Active`);
  console.log(`========================================================`);
});

export default app;

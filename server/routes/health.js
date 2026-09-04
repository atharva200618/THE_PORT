import express from 'express';
import db from '../db.js';

const router = express.Router();

/**
 * GET /api/health
 * Returns service status, system uptime, and job statistics
 */
router.get('/', (req, res) => {
  const stats = db.getStats();
  return res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    stats
  });
});

export default router;

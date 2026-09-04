import express from 'express';
import os from 'node:os';
import db from '../db.js';

const router = express.Router();

// In-memory worker heartbeat tracking
let lastWorkerHeartbeat = { timestamp: 0, info: null };

/**
 * Get local Wi-Fi / LAN IP address for cross-device mobile testing
 */
export function getLocalNetworkIp() {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch {
    // fallback
  }
  return 'localhost';
}

/**
 * POST /api/worker/heartbeat
 * Worker periodically pings backend to report online status
 */
router.post('/heartbeat', (req, res) => {
  lastWorkerHeartbeat = {
    timestamp: Date.now(),
    info: req.body || {}
  };
  return res.json({ success: true, timestamp: lastWorkerHeartbeat.timestamp });
});

/**
 * GET /api/worker/status
 * Public endpoint to check if the Mac Worker conversion engine is online
 */
router.get('/status', (req, res) => {
  const isOnline = (Date.now() - lastWorkerHeartbeat.timestamp) < 15000;
  const stats = db.getStats();
  return res.json({
    online: isOnline,
    lastSeen: lastWorkerHeartbeat.timestamp ? new Date(lastWorkerHeartbeat.timestamp).toISOString() : null,
    localIp: getLocalNetworkIp(),
    info: lastWorkerHeartbeat.info,
    stats
  });
});

export default router;

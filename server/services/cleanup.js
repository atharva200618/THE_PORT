import { cleanExpiredFilesAndJobs } from '../storage.js';

const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
const KEEP_ALIVE_INTERVAL_MS = 9 * 60 * 1000; // 9 minutes

/**
 * Initializes background cleanup tasks and Render anti-cold-start self ping
 */
export function startCleanupService() {
  // Initial cleanup on boot
  try {
    cleanExpiredFilesAndJobs(24);
  } catch (err) {
    console.error('[Initial Cleanup Error]:', err);
  }

  // Run cleanup cron every 30 minutes
  setInterval(() => {
    try {
      cleanExpiredFilesAndJobs(24);
    } catch (err) {
      console.error('[Cleanup Cron Error]:', err);
    }
  }, CLEANUP_INTERVAL_MS);

  // ==============================================================================
  // SELF-PING KEEP-ALIVE (Prevents Render Free Tier Cold Start)
  // Pings own /api/health every 9 minutes — Render spins down after 15 min idle
  // ==============================================================================
  if (process.env.RENDER) {
    const SELF_URL = process.env.RENDER_EXTERNAL_URL
      ? `https://${process.env.RENDER_EXTERNAL_URL}`
      : `https://the-port.onrender.com`;

    setInterval(async () => {
      try {
        const res = await fetch(`${SELF_URL}/api/health`);
        const data = await res.json();
        console.log(`[KeepAlive] Self-ping OK — uptime: ${Math.round(data.uptime)}s`);
      } catch (err) {
        console.warn(`[KeepAlive] Self-ping failed: ${err.message}`);
      }
    }, KEEP_ALIVE_INTERVAL_MS);

    console.log(`[KeepAlive] Anti-cold-start cron active — pinging every 9 min`);
  }
}

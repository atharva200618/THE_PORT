import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const STORAGE_DIR = path.join(__dirname, 'storage');
export const UPLOADS_DIR = path.join(STORAGE_DIR, 'uploads');
export const OUTPUTS_DIR = path.join(STORAGE_DIR, 'outputs');

// Ensure storage directories exist
[STORAGE_DIR, UPLOADS_DIR, OUTPUTS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export function getInputFilePath(filename) {
  if (!filename) return null;
  return path.join(UPLOADS_DIR, filename);
}

export function getOutputFilePath(filename) {
  if (!filename) return null;
  return path.join(OUTPUTS_DIR, filename);
}

export function deleteFileIfExists(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (err) {
    console.error(`[Storage] Failed to delete file ${filePath}:`, err.message);
  }
  return false;
}

/**
 * 24-hour Auto-Expiration & Garbage Collection
 * Deletes all uploads, outputs, and job rows created > 24h ago (or configurable TTL)
 */
export function cleanExpiredFilesAndJobs(ttlHours = 24) {
  const ttlMs = ttlHours * 60 * 60 * 1000;
  const cutoffTimestamp = Date.now() - ttlMs;

  console.log(`[Cleanup Cron] Running 24-hour purge (cutoff: ${new Date(cutoffTimestamp).toISOString()})...`);
  const expiredJobs = db.getExpiredJobs(cutoffTimestamp);

  let purgedCount = 0;
  for (const job of expiredJobs) {
    // Delete input file
    if (job.inputFilename) {
      deleteFileIfExists(getInputFilePath(job.inputFilename));
    }
    // Delete output file
    if (job.outputFilename) {
      deleteFileIfExists(getOutputFilePath(job.outputFilename));
    }
    // Delete database record
    db.deleteJob(job.id);
    purgedCount++;
  }

  // Also clean up any orphan files older than cutoff in storage dirs
  cleanOrphanFiles(UPLOADS_DIR, cutoffTimestamp);
  cleanOrphanFiles(OUTPUTS_DIR, cutoffTimestamp);

  console.log(`[Cleanup Cron] Purged ${purgedCount} expired job(s) and associated files.`);
  return purgedCount;
}

function cleanOrphanFiles(directory, cutoffTimestamp) {
  try {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stats = fs.statSync(fullPath);
      if (stats.mtimeMs < cutoffTimestamp) {
        fs.unlinkSync(fullPath);
        console.log(`[Cleanup Cron] Removed orphan file: ${file}`);
      }
    }
  } catch (err) {
    console.error(`[Cleanup Cron] Orphan cleanup error in ${directory}:`, err.message);
  }
}

export default {
  STORAGE_DIR,
  UPLOADS_DIR,
  OUTPUTS_DIR,
  getInputFilePath,
  getOutputFilePath,
  deleteFileIfExists,
  cleanExpiredFilesAndJobs
};

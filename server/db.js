import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'the_port.db');
const db = new DatabaseSync(DB_PATH);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    original_name TEXT NOT NULL,
    source_format TEXT NOT NULL,
    target_format TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    input_filename TEXT NOT NULL,
    output_filename TEXT,
    error_message TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    completed_at INTEGER
  );

  CREATE INDEX IF NOT EXISTS idx_jobs_status_created ON jobs(status, created_at ASC);
`);

/**
 * Creates a new conversion job with status 'pending'
 */
export function createJob({ id, originalName, sourceFormat, targetFormat, fileSize, inputFilename }) {
  const now = Date.now();
  const stmt = db.prepare(`
    INSERT INTO jobs (
      id, original_name, source_format, target_format, file_size,
      status, input_filename, output_filename, error_message,
      created_at, updated_at, completed_at
    ) VALUES (?, ?, ?, ?, ?, 'pending', ?, NULL, NULL, ?, ?, NULL)
  `);

  stmt.run(id, originalName, sourceFormat, targetFormat, fileSize, inputFilename, now, now);
  return getJobById(id);
}

/**
 * Retrieves a job by ID
 */
export function getJobById(id) {
  const stmt = db.prepare(`SELECT * FROM jobs WHERE id = ?`);
  const row = stmt.get(id);
  if (!row) return null;
  return formatJobRow(row);
}

/**
 * Atomically retrieves the oldest pending job and marks it as 'processing'
 */
export function getNextPendingJob() {
  // SQLite transaction for atomic update
  const findStmt = db.prepare(`
    SELECT * FROM jobs 
    WHERE status = 'pending' 
    ORDER BY created_at ASC 
    LIMIT 1
  `);

  const row = findStmt.get();
  if (!row) return null;

  const now = Date.now();
  const updateStmt = db.prepare(`
    UPDATE jobs 
    SET status = 'processing', updated_at = ? 
    WHERE id = ? AND status = 'pending'
  `);

  const result = updateStmt.run(now, row.id);
  if (result.changes === 0) {
    // Another worker picked it up in race condition
    return null;
  }

  return getJobById(row.id);
}

/**
 * Marks a job as completed with its output file
 */
export function completeJob(id, outputFilename) {
  const now = Date.now();
  const stmt = db.prepare(`
    UPDATE jobs 
    SET status = 'done', output_filename = ?, completed_at = ?, updated_at = ? 
    WHERE id = ?
  `);
  stmt.run(outputFilename, now, now, id);
  return getJobById(id);
}

/**
 * Marks a job as failed with an error message
 */
export function failJob(id, errorMessage) {
  const now = Date.now();
  const stmt = db.prepare(`
    UPDATE jobs 
    SET status = 'failed', error_message = ?, completed_at = ?, updated_at = ? 
    WHERE id = ?
  `);
  stmt.run(errorMessage || 'Unknown conversion error occurred.', now, now, id);
  return getJobById(id);
}

/**
 * Retrieves expired jobs older than cutoff timestamp
 */
export function getExpiredJobs(cutoffTimestampMs) {
  const stmt = db.prepare(`SELECT * FROM jobs WHERE created_at < ?`);
  return stmt.all(cutoffTimestampMs).map(formatJobRow);
}

/**
 * Deletes a job row
 */
export function deleteJob(id) {
  const stmt = db.prepare(`DELETE FROM jobs WHERE id = ?`);
  stmt.run(id);
}

/**
 * Returns overall queue statistics
 */
export function getStats() {
  const rows = db.prepare(`
    SELECT status, COUNT(*) as count 
    FROM jobs 
    GROUP BY status
  `).all();

  const stats = { pending: 0, processing: 0, done: 0, failed: 0, total: 0 };
  for (const r of rows) {
    stats[r.status] = r.count;
    stats.total += r.count;
  }
  return stats;
}

function formatJobRow(row) {
  return {
    id: row.id,
    originalName: row.original_name,
    sourceFormat: row.source_format,
    targetFormat: row.target_format,
    fileSize: row.file_size,
    status: row.status,
    inputFilename: row.input_filename,
    outputFilename: row.output_filename,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at
  };
}

export default {
  createJob,
  getJobById,
  getNextPendingJob,
  completeJob,
  failJob,
  getExpiredJobs,
  deleteJob,
  getStats
};

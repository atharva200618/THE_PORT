#!/usr/bin/env node
/**
 * The Port — Mac Worker Daemon
 * 
 * Standalone background worker that polls the Backend API for conversion jobs,
 * downloads input documents, runs `./convert.sh`, and reports back results.
 * 
 * Runs sequentially (1 job at a time) to ensure Apple Pages GUI stability.
 * Features:
 *  - 30-second timeout watchdog with process auto-recovery
 *  - Live heartbeat emission to Backend API
 *  - Persistent timestamped file logging (worker.log)
 */

import { spawn, exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '3000', 10);
const HEARTBEAT_INTERVAL_MS = 5000;
const CONVERT_TIMEOUT_MS = 90000; // 90s timeout — Apple apps need time to launch
const CONVERT_SCRIPT = process.env.CONVERT_SCRIPT || path.join(ROOT_DIR, 'convert.sh');
const LOG_FILE = path.join(__dirname, 'worker.log');
const WORKER_TEMP_DIR = path.join(os.tmpdir(), 'the_port_worker');

// Ensure temp and log directories exist
if (!fs.existsSync(WORKER_TEMP_DIR)) {
  fs.mkdirSync(WORKER_TEMP_DIR, { recursive: true });
}

// Logger utility
function log(level, message, meta = null) {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
  const line = `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
  
  if (level === 'error') {
    process.stderr.write(line);
  } else {
    process.stdout.write(line);
  }

  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch (err) {
    console.error('Failed writing to log file:', err.message);
  }
}

// Ensure convert.sh exists and is executable
function verifyConvertScript() {
  if (!fs.existsSync(CONVERT_SCRIPT)) {
    log('error', `convert.sh not found at ${CONVERT_SCRIPT}`);
    process.exit(1);
  }
  try {
    fs.chmodSync(CONVERT_SCRIPT, '755');
  } catch (err) {
    log('warn', `Could not chmod convert.sh: ${err.message}`);
  }
}

/**
 * Downloads a file from the backend API to a local temp path
 */
async function downloadFile(urlPath, destinationPath) {
  const fullUrl = urlPath.startsWith('http') ? urlPath : `${BACKEND_URL}${urlPath}`;
  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw new Error(`Failed to download file from ${fullUrl}: HTTP ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(destinationPath, Buffer.from(arrayBuffer));
}

/**
 * Clean up hung processes if stuck
 */
function cleanupHungProcesses() {
  try {
    exec('killall -9 Pages Keynote Numbers soffice 2>/dev/null', () => {});
  } catch {
    // ignore
  }
}

/**
 * Runs the ./convert.sh subprocess with a 30s timeout watchdog
 */
function executeConvertScript(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    log('info', `Spawning convert script: ${CONVERT_SCRIPT}`, { inputPath, outputPath });

    let isSettled = false;
    const proc = spawn(CONVERT_SCRIPT, [inputPath, outputPath], {
      cwd: ROOT_DIR,
      env: { ...process.env, PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin' }
    });

    let stdout = '';
    let stderr = '';

    const timeoutTimer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        log('error', `Subprocess timed out after ${CONVERT_TIMEOUT_MS / 1000}s. Killing process and recovering...`);
        try {
          proc.kill('SIGKILL');
        } catch {
          // ignore
        }
        cleanupHungProcesses();
        reject(new Error(`Conversion timed out after ${CONVERT_TIMEOUT_MS / 1000}s. Check if document has complex layout or password protection.`));
      }
    }, CONVERT_TIMEOUT_MS);

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      clearTimeout(timeoutTimer);
      if (isSettled) return;
      isSettled = true;

      if (code === 0 && fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
        log('info', 'Subprocess completed successfully', { stdout: stdout.trim() });
        resolve({ stdout, stderr });
      } else {
        const errorMsg = stderr.trim() || stdout.trim() || `Process exited with code ${code}`;
        log('error', 'Subprocess conversion failed', { code, errorMsg });
        reject(new Error(errorMsg));
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timeoutTimer);
      if (isSettled) return;
      isSettled = true;
      log('error', 'Failed to start subprocess', { error: err.message });
      reject(err);
    });
  });
}

/**
 * Uploads the converted output file back to the backend API
 */
async function reportComplete(jobId, outputPath, outputFilename) {
  const fullUrl = `${BACKEND_URL}/api/jobs/${jobId}/complete`;
  const fileBuffer = fs.readFileSync(outputPath);
  const blob = new Blob([fileBuffer]);

  const formData = new FormData();
  formData.append('file', blob, outputFilename);

  const response = await fetch(fullUrl, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed reporting completion to backend: HTTP ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Reports a failure to the backend API
 */
async function reportFailure(jobId, errorMessage) {
  const fullUrl = `${BACKEND_URL}/api/jobs/${jobId}/fail`;
  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: errorMessage })
    });
    return response.json();
  } catch (err) {
    log('error', `Failed to report failure to backend for job ${jobId}: ${err.message}`);
  }
}

/**
 * Emits heartbeat to the backend API
 */
async function sendHeartbeat() {
  try {
    await fetch(`${BACKEND_URL}/api/worker/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'macOS Apple Silicon (M1)',
        arch: os.arch(),
        uptime: os.uptime(),
        hostname: os.hostname()
      })
    });
  } catch {
    // Ignore heartbeat network drops silently
  }
}

/**
 * Processes a single job
 */
async function processJob(job) {
  log('info', `=== Starting Job [${job.id}] ===`, {
    name: job.originalName,
    source: job.sourceFormat,
    target: job.targetFormat
  });

  const baseName = path.basename(job.originalName, path.extname(job.originalName)).replace(/[^a-zA-Z0-9_-]/g, '_');
  const tempInputPath = path.join(WORKER_TEMP_DIR, `in_${job.id}.${job.sourceFormat}`);
  const tempOutputPath = path.join(WORKER_TEMP_DIR, `out_${job.id}.${job.targetFormat}`);
  const outputFileName = `${baseName}.${job.targetFormat}`;

  try {
    // 1. Download input file
    log('info', `Downloading source file for job ${job.id}...`);
    await downloadFile(job.fileUrl, tempInputPath);

    // 2. Run conversion
    log('info', `Executing conversion for job ${job.id}...`);
    await executeConvertScript(tempInputPath, tempOutputPath);

    // 3. Upload result
    log('info', `Uploading converted output for job ${job.id}...`);
    await reportComplete(job.id, tempOutputPath, outputFileName);

    log('info', `=== Job [${job.id}] COMPLETED Successfully ===`);
  } catch (err) {
    log('error', `=== Job [${job.id}] FAILED ===`, { error: err.message });
    await reportFailure(job.id, err.message);
  } finally {
    // Clean up local temp files
    try {
      if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
      if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
    } catch (cleanupErr) {
      log('warn', `Temp cleanup warning: ${cleanupErr.message}`);
    }
  }
}

/**
 * Main polling loop
 */
let isRunning = true;
let isBusy = false;

async function pollQueue() {
  if (!isRunning || isBusy) return;

  try {
    const response = await fetch(`${BACKEND_URL}/api/jobs/next`);
    if (!response.ok) {
      log('warn', `Backend poll returned HTTP ${response.status}`);
      return;
    }

    const data = await response.json();
    if (data && data.job) {
      isBusy = true;
      try {
        await processJob(data.job);
      } finally {
        isBusy = false;
      }
      // If we just processed a job, check for another one immediately
      setImmediate(pollQueue);
      return;
    }
  } catch (err) {
    log('warn', `Polling connection error: ${err.message}`);
  }
}

function startDaemon() {
  verifyConvertScript();

  log('info', '========================================================');
  log('info', ' The Port — Mac Worker Daemon Started');
  log('info', ` Backend Target: ${BACKEND_URL}`);
  log('info', ` Poll Interval: ${POLL_INTERVAL_MS}ms`);
  log('info', ` Watchdog Timeout: ${CONVERT_TIMEOUT_MS / 1000}s`);
  log('info', ` Convert Script: ${CONVERT_SCRIPT}`);
  log('info', ` Temp Storage: ${WORKER_TEMP_DIR}`);
  log('info', ` Log File: ${LOG_FILE}`);
  log('info', '========================================================');

  // Start polling interval
  const timer = setInterval(pollQueue, POLL_INTERVAL_MS);

  // Start heartbeat interval
  const heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
  sendHeartbeat();

  // Initial poll
  pollQueue();

  // Graceful shutdown handlers
  const shutdown = () => {
    log('info', 'Shutting down Mac Worker Daemon gracefully...');
    isRunning = false;
    clearInterval(timer);
    clearInterval(heartbeatTimer);
    setTimeout(() => {
      log('info', 'Worker stopped.');
      process.exit(0);
    }, 1000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startDaemon();

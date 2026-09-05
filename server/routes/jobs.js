import express from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { spawn, execSync } from 'node:child_process';
import crypto from 'node:crypto';
import db from '../db.js';
import storage from '../storage.js';
import { upload, outputUpload, ALLOWED_EXTENSIONS } from '../middleware/upload.js';

const router = express.Router();
const CONVERT_SCRIPT = path.join(process.cwd(), 'convert.sh');
let isJobProcessing = false;

/**
 * Resolves the target format for a given source extension
 */
export function resolveTargetFormat(sourceExt, requestedFormat) {
  if (requestedFormat) {
    const cleaned = requestedFormat.toLowerCase().replace(/^\./, '');
    if (ALLOWED_EXTENSIONS.has(cleaned)) {
      return cleaned;
    }
  }
  // Image to PDF
  if (['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(sourceExt)) return 'pdf';
  // Default routing
  if (sourceExt === 'pages') return 'docx';
  if (sourceExt === 'key') return 'pptx';
  if (sourceExt === 'pptx' || sourceExt === 'ppt') return 'key';
  if (sourceExt === 'numbers') return 'xlsx';
  if (sourceExt === 'xlsx' || sourceExt === 'xls' || sourceExt === 'csv') return 'numbers';
  return 'pages';
}

/**
 * Integrated Direct Mac Engine Runner (Zero-Delay Local Conversion)
 */
export async function processNextJobDirectly() {
  if (process.platform !== 'darwin') {
    // On Linux (Render cloud), wait for connected Mac Worker daemon
    return;
  }
  if (isJobProcessing) return;
  const job = db.getNextPendingJob();
  if (!job) return;

  isJobProcessing = true;
  console.log(`[Direct Engine] Processing Job ${job.id}: ${job.originalName} (${job.sourceFormat} -> ${job.targetFormat})`);

  try {
    const inputPath = storage.getInputFilePath(job.inputFilename);
    const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const baseName = job.originalName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.[^/.]+$/, '');
    const outputFilename = `out_${job.id}_${uniqueSuffix}_${baseName}.${job.targetFormat}`;
    const outputPath = storage.getOutputFilePath(outputFilename);

    const convertArgs = [inputPath, outputPath];
    if (job.targetFormat === 'protect' && job.options?.password) {
      convertArgs.push(job.options.password);
    }

    await new Promise((resolve, reject) => {
      const proc = spawn(CONVERT_SCRIPT, convertArgs, {
        env: {
          ...process.env,
          PATH: `/tmp/pdf2docx_env/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ''}`
        }
      });

      let stdout = '';
      let stderr = '';
      const timer = setTimeout(() => {
        try { proc.kill('SIGKILL'); } catch {}
        reject(new Error('Conversion script timed out after 30 seconds.'));
      }, 30000);

      proc.stdout.on('data', (d) => { stdout += d.toString(); });
      proc.stderr.on('data', (d) => { stderr += d.toString(); });

      proc.on('close', (code) => {
        clearTimeout(timer);
        if (code === 0 && fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
          resolve({ stdout, stderr });
        } else {
          const errMsg = stderr.trim() || stdout.trim() || `Conversion process exited with code ${code}`;
          reject(new Error(errMsg));
        }
      });

      proc.on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });

    db.completeJob(job.id, outputFilename);
    console.log(`[Direct Engine] Job ${job.id} COMPLETED successfully -> ${outputFilename}`);
  } catch (err) {
    console.error(`[Direct Engine] Job ${job.id} FAILED:`, err.message);
    db.failJob(job.id, err.message);
  } finally {
    isJobProcessing = false;
    setImmediate(processNextJobDirectly);
  }
}

// -----------------------------------------------------------------------------
// Public Endpoints (Browser / Client)
// -----------------------------------------------------------------------------

/**
 * POST /api/convert
 * Accepts file upload + target format, enqueues conversion job
 */
router.post('/convert', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'File is too large. Maximum file size is 50MB.'
        });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No document file was uploaded.' });
    }

    const originalName = req.file.originalname;
    const sourceExt = (originalName.split('.').pop() || '').toLowerCase();
    const requestedFormat = (req.body.targetFormat || req.body.target || req.query.targetFormat || '').toLowerCase().replace(/^\./, '');
    const isSpecialPdfTool = ['compress', 'compressed', 'split', 'rotate', 'watermark', 'protect', 'unprotect', 'ocr', 'merge'].includes(requestedFormat);
    const targetFormat = isSpecialPdfTool ? (requestedFormat === 'compressed' ? 'compress' : requestedFormat) : resolveTargetFormat(sourceExt, requestedFormat);

    if (targetFormat === 'protect') {
      const password = req.body.password;
      if (!password || (typeof password === 'string' && !password.trim())) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: 'Password is required to protect this PDF' });
      }
    }

    if (sourceExt === targetFormat && !isSpecialPdfTool) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: `Source format is already .${sourceExt}. Please choose a different target format.`
      });
    }

    const jobOptions = targetFormat === 'protect' ? { password: req.body.password } : {};

    const jobId = `job_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const job = db.createJob({
      id: jobId,
      originalName: originalName,
      sourceFormat: sourceExt,
      targetFormat: targetFormat,
      fileSize: req.file.size,
      inputFilename: req.file.filename,
      options: jobOptions
    });

    console.log(`[API] Enqueued conversion job: ${jobId} (${sourceExt} -> ${targetFormat}, ${req.file.size} bytes)`);

    // Trigger direct conversion runner immediately
    setImmediate(processNextJobDirectly);

    return res.status(201).json({
      success: true,
      jobId: job.id,
      status: job.status,
      originalName: job.originalName,
      sourceFormat: job.sourceFormat,
      targetFormat: job.targetFormat,
      fileSize: job.fileSize,
      createdAt: job.createdAt
    });
  });
});

/**
 * POST /api/jobs/merge
 * Merges multiple uploaded PDF files into a single unified PDF document
 */
router.post('/merge', (req, res) => {
  upload.array('files', 30)(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least 2 PDF files to merge.' });
    }

    const inputFilenames = req.files.map(f => f.filename);
    const totalSize = req.files.reduce((sum, f) => sum + f.size, 0);
    const jobId = `job_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const outputName = req.body.outputName || 'Merged_Collection.pdf';

    const job = db.createMergeJob({
      id: jobId,
      originalName: outputName,
      inputFilenames,
      fileSize: totalSize
    });

    console.log(`[API] Enqueued PDF Merge Job: ${jobId} (${req.files.length} PDFs, ${totalSize} bytes)`);

    // Perform direct merge via media_pdf_engine.py
    try {
      const outputFilename = `out_${job.id}_merged.pdf`;
      const outputPath = storage.getOutputFilePath(outputFilename);
      const inputPaths = inputFilenames.map(f => storage.getInputFilePath(f));

      const pythonBin = fs.existsSync(path.join(process.cwd(), 'venv/bin/python'))
        ? path.join(process.cwd(), 'venv/bin/python')
        : 'python3';
      const mediaScript = path.join(process.cwd(), 'media_pdf_engine.py');

      await new Promise((resolve, reject) => {
        const proc = spawn(pythonBin, [mediaScript, 'merge', ...inputPaths, outputPath]);
        proc.on('close', (code) => {
          if (code === 0 && fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
            resolve();
          } else {
            reject(new Error(`PDF merge process exited with code ${code}`));
          }
        });
        proc.on('error', reject);
      });

      db.completeJob(job.id, outputFilename);
      console.log(`[API] PDF Merge Job ${job.id} COMPLETED -> ${outputFilename}`);

      return res.status(201).json({
        success: true,
        jobId: job.id,
        status: 'done',
        downloadUrl: `/api/jobs/${job.id}/download`,
        outputName: outputName
      });
    } catch (mergeErr) {
      console.error(`[API] PDF Merge Job ${job.id} direct merge error:`, mergeErr.message);
      return res.status(201).json({
        success: true,
        jobId: job.id,
        status: 'pending'
      });
    }
  });
});

// -----------------------------------------------------------------------------
// Job Polling, File Serving, and Worker Endpoints
// Specific / static routes MUST be declared before parameterized routes (:id)
// -----------------------------------------------------------------------------

/**
 * GET /api/jobs/next
 * Used by the Mac worker to pick up the oldest pending job (supports ?type=apple or ?type=non_apple)
 */
router.get('/next', (req, res) => {
  const filter = req.query.type || req.query.lane || (req.query.non_apple_only === 'true' ? 'non_apple' : 'any');
  const job = db.getNextPendingJob(filter);
  if (!job) {
    return res.json({ job: null });
  }

  console.log(`[Worker API] Dispatched job ${job.id} to Mac Worker (${job.sourceFormat} -> ${job.targetFormat}) [Filter: ${filter}]`);

  return res.json({
    job: {
      id: job.id,
      sourceFormat: job.sourceFormat,
      targetFormat: job.targetFormat,
      originalName: job.originalName,
      fileSize: job.fileSize,
      fileUrl: `/api/jobs/${job.id}/file`,
      options: job.options || {},
      createdAt: job.createdAt
    }
  });
});

/**
 * DELETE /api/jobs/:id
 * Immediately purges job and files from disk & database for privacy
 */
router.delete('/:id', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found.' });
  }

  if (job.inputFilename) {
    storage.deleteFileIfExists(storage.getInputFilePath(job.inputFilename));
  }
  if (job.outputFilename) {
    storage.deleteFileIfExists(storage.getOutputFilePath(job.outputFilename));
  }
  db.deleteJob(job.id);
  console.log(`[API] Job ${job.id} and associated files immediately deleted upon user request.`);

  return res.json({ success: true, message: 'Document deleted from server.' });
});

/**
 * GET /api/jobs/:id
 * Polls job status and metadata
 */
router.get('/:id', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: `Job with ID '${req.params.id}' was not found.` });
  }

  const response = {
    id: job.id,
    status: job.status,
    originalName: job.originalName,
    sourceFormat: job.sourceFormat,
    targetFormat: job.targetFormat,
    fileSize: job.fileSize,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    completedAt: job.completedAt,
    error: job.errorMessage || null,
    downloadUrl: job.status === 'done' ? `/api/jobs/${job.id}/download` : null
  };

  return res.json(response);
});

/**
 * GET /api/jobs/:id/download
 * Serves the completed converted file
 */
router.get('/:id/download', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found.' });
  }

  if (job.status !== 'done' || !job.outputFilename) {
    return res.status(400).json({ error: 'Conversion is not completed yet or failed.' });
  }

  const filePath = storage.getOutputFilePath(job.outputFilename);
  if (!fs.existsSync(filePath)) {
    return res.status(410).json({ error: 'Converted file has expired or was removed.' });
  }

  const baseName = job.originalName.replace(/\.[^/.]+$/, '');
  let downloadExt = job.targetFormat;
  if (['compress', 'compressed', 'rotate', 'watermark', 'protect', 'unprotect', 'ocr'].includes(downloadExt)) {
    downloadExt = 'pdf';
  } else if (downloadExt === 'split') {
    downloadExt = 'zip';
  }
  const downloadFileName = `${baseName}.${downloadExt}`;

  return res.download(filePath, downloadFileName);
});

/**
 * GET /api/jobs/:id/view
 * Streams PDF file inline for seamless viewing in browser tab (no download prompt)
 */
router.get('/:id/view', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job || !job.outputFilename || job.status !== 'done') {
    return res.status(404).json({ error: 'File not ready.' });
  }

  const filePath = storage.getOutputFilePath(job.outputFilename);
  if (!fs.existsSync(filePath)) {
    return res.status(410).json({ error: 'Converted file has expired.' });
  }

  if (['pdf', 'compress', 'compressed', 'rotate', 'watermark', 'protect', 'unprotect', 'ocr'].includes(job.targetFormat)) {
    const baseName = job.originalName.replace(/\.[^/.]+$/, '');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(baseName)}.pdf"`);
    return res.sendFile(filePath);
  }

  return res.redirect(`/api/jobs/${job.id}/download`);
});

/**
 * GET /api/jobs/:id/preview
 * Serves live visual preview for the document:
 *  - For .pages: extracts and streams embedded preview.jpg from the Pages bundle
 *  - For .pdf: streams the PDF file
 */
router.get('/:id/preview', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job || !job.outputFilename || job.status !== 'done') {
    return res.status(404).json({ error: 'Preview not available for this job.' });
  }

  const filePath = storage.getOutputFilePath(job.outputFilename);
  if (!fs.existsSync(filePath)) {
    return res.status(410).json({ error: 'File expired.' });
  }

  if (job.targetFormat === 'pages') {
    try {
      let imageBuffer = null;
      try {
        imageBuffer = execSync(`/usr/bin/unzip -p "${filePath}" preview.jpg`, { maxBuffer: 10 * 1024 * 1024 });
      } catch {
        try {
          imageBuffer = execSync(`/usr/bin/unzip -p "${filePath}" preview-web.jpg`, { maxBuffer: 10 * 1024 * 1024 });
        } catch {
          // not found
        }
      }

      if (imageBuffer && imageBuffer.length > 0) {
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.send(imageBuffer);
      }
    } catch (err) {
      console.error('[Preview Extract Error]:', err);
    }
    return res.status(404).json({ error: 'Preview image not found in .pages package.' });
  } else if (job.targetFormat === 'pdf') {
    res.setHeader('Content-Type', 'application/pdf');
    return res.sendFile(filePath);
  } else {
    return res.status(400).json({ error: 'Direct preview not supported for this format.' });
  }
});

/**
 * GET /api/jobs/:id/file
 * Worker endpoint to download the input file
 */
router.get('/:id/file', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found.' });
  }

  const filePath = storage.getInputFilePath(job.inputFilename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Source file not found on disk.' });
  }

  return res.sendFile(filePath);
});

/**
 * POST /api/jobs/:id/complete
 * Worker uploads the converted file and marks job as 'done'
 */
router.post('/:id/complete', outputUpload.single('file'), (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(404).json({ error: 'Job not found.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No converted output file was provided.' });
  }

  db.completeJob(job.id, req.file.filename);
  console.log(`[Worker API] Job ${job.id} marked as DONE. Output: ${req.file.filename}`);

  return res.json({
    success: true,
    jobId: job.id,
    status: 'done'
  });
});

/**
 * POST /api/jobs/:id/fail
 * Worker reports conversion failure with diagnostic error
 */
router.post('/:id/fail', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found.' });
  }

  const errorMessage = req.body.error || 'Conversion subprocess failed on Mac worker.';
  db.failJob(job.id, errorMessage);
  console.error(`[Worker API] Job ${job.id} marked as FAILED. Reason: ${errorMessage}`);

  return res.json({
    success: true,
    jobId: job.id,
    status: 'failed'
  });
});

export default router;

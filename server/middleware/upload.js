import multer from 'multer';
import crypto from 'node:crypto';
import { UPLOADS_DIR, OUTPUTS_DIR } from '../storage.js';

// 50MB max file size limit
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = new Set([
  'docx', 'doc', 'pdf', 'pages', 'key', 'pptx', 'ppt',
  'numbers', 'xlsx', 'xls', 'csv',
  'jpg', 'jpeg', 'png', 'webp', 'heic',
  'zip', 'txt', 'md', 'compress', 'compressed'
]);

// Multer storage configuration for uploads
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${uniqueSuffix}_${sanitizedName}`);
  }
});

export const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new Error(`Unsupported file extension '.${ext}'. Allowed: documents, spreadsheets, presentations, and images.`));
    }
    cb(null, true);
  }
});

// Multer storage configuration for worker output upload
const outputStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, OUTPUTS_DIR);
  },
  filename: (req, file, cb) => {
    const jobId = req.params.id || 'unknown';
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `out_${jobId}_${sanitizedName}`);
  }
});

export const outputUpload = multer({
  storage: outputStorage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES }
});

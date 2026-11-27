import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { isCloudinaryConfigured, uploadBufferToCloudinary } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure local fallback upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const memoryStorage = multer.memoryStorage();

// Raster images only (excludes SVG to prevent stored XSS)
const imageFileFilter = (req, file, cb) => {
  const allowedExt = /\.(jpeg|jpg|png|webp|gif)$/i;
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const mimeOk = allowedMimes.includes((file.mimetype || '').toLowerCase());
  const extOk = allowedExt.test(path.extname(file.originalname || '').toLowerCase());

  if (mimeOk && extOk) {
    return cb(null, true);
  }
  cb(new Error('Only raster image files (JPEG, JPG, PNG, WEBP, GIF) are allowed!'));
};

// General media filter for admin (images, MP4/WebM videos, PDF documents)
const mediaFileFilter = (req, file, cb) => {
  const allowedExt = /\.(jpeg|jpg|png|webp|gif|mp4|webm|pdf)$/i;
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ];
  const mimeOk = allowedMimes.includes((file.mimetype || '').toLowerCase());
  const extOk = allowedExt.test(path.extname(file.originalname || '').toLowerCase());

  if (mimeOk && extOk) {
    return cb(null, true);
  }
  cb(new Error('Only images, MP4/WebM videos, or PDF documents are allowed!'));
};

export const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 20 }, // 10MB per file, max 20 files
  fileFilter: imageFileFilter
});

export const uploadMedia = multer({
  storage: memoryStorage,
  limits: { fileSize: 50 * 1024 * 1024, files: 10 }, // 50MB per media file
  fileFilter: mediaFileFilter
});

/**
 * Persists an uploaded Multer memory file to Cloudinary (if configured) or local disk fallback.
 */
export const persistUploadedFile = async (file, options = {}) => {
  if (!file || !file.buffer) {
    throw new Error('Invalid uploaded file buffer');
  }

  if (isCloudinaryConfigured()) {
    const resourceType = options.resourceType || (file.mimetype?.startsWith('video/') ? 'video' : file.mimetype === 'application/pdf' ? 'raw' : 'image');
    const cloudRes = await uploadBufferToCloudinary(file.buffer, {
      folder: options.folder || 'vehicles',
      originalname: file.originalname,
      resourceType
    });
    return {
      url: cloudRes.url,
      storage: 'cloudinary',
      filename: cloudRes.publicId,
      size: file.size,
      mimetype: file.mimetype
    };
  }

  // Local disk fallback when Cloudinary credentials are not configured
  const ext = path.extname(file.originalname || '').toLowerCase();
  const baseName = path.basename(file.originalname || 'file', ext).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const uniqueName = `${baseName}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const destPath = path.join(uploadDir, uniqueName);
  fs.writeFileSync(destPath, file.buffer);

  return {
    url: `/uploads/${uniqueName}`,
    storage: 'local',
    filename: uniqueName,
    size: file.size,
    mimetype: file.mimetype
  };
};

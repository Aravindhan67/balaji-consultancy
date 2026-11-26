import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter for raster images only (excludes SVG to prevent stored XSS)
const fileFilter = (req, file, cb) => {
  const allowedExt = /\.(jpeg|jpg|png|webp|gif)$/i;
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const mimeOk = allowedMimes.includes((file.mimetype || '').toLowerCase());
  const extOk = allowedExt.test(path.extname(file.originalname || '').toLowerCase());

  if (mimeOk && extOk) {
    return cb(null, true);
  }
  cb(new Error('Only raster image files (JPEG, JPG, PNG, WEBP, GIF) are allowed!'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 20 }, // 10MB per file, max 20 files per request
  fileFilter
});

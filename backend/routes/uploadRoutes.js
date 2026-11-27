import express from 'express';
import { upload, uploadMedia, persistUploadedFile } from '../middleware/upload.js';
import { verifyAdmin } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Single image upload (Admin only)
router.post('/single', verifyAdmin, uploadLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const saved = await persistUploadedFile(req.file, { folder: 'vehicles', resourceType: 'image' });
    res.json({
      success: true,
      message: `Image uploaded successfully (${saved.storage})`,
      url: saved.url,
      storage: saved.storage,
      file: {
        filename: saved.filename,
        size: saved.size,
        mimetype: saved.mimetype
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Multiple image upload (Rate-limited; used by Admin & Quotation photo upload)
router.post('/multiple', uploadLimiter, upload.array('images', 15), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }
    const results = await Promise.all(
      req.files.map((file) => persistUploadedFile(file, { folder: 'vehicles', resourceType: 'image' }))
    );
    const urls = results.map((r) => r.url);
    res.json({
      success: true,
      message: `${results.length} images uploaded successfully (${results[0]?.storage})`,
      storage: results[0]?.storage,
      urls
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// General media upload: videos, PDFs, or images (Admin only)
router.post('/media', verifyAdmin, uploadLimiter, uploadMedia.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No media file uploaded' });
    }
    const saved = await persistUploadedFile(req.file, { folder: 'media' });
    res.json({
      success: true,
      message: `Media uploaded successfully (${saved.storage})`,
      url: saved.url,
      storage: saved.storage,
      file: {
        filename: saved.filename,
        size: saved.size,
        mimetype: saved.mimetype
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

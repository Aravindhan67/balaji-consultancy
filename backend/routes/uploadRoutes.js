import express from 'express';
import { upload } from '../middleware/upload.js';
import { verifyAdmin } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Single image upload (Admin only)
router.post('/single', verifyAdmin, uploadLimiter, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Image uploaded successfully to backend',
      url: imageUrl,
      file: {
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Multiple image upload (Rate-limited; used by Admin & Quotation photo upload)
router.post('/multiple', uploadLimiter, upload.array('images', 15), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }
    const urls = req.files.map(f => `/uploads/${f.filename}`);
    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully to backend`,
      urls
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

import express from 'express';
import jwt from 'jsonwebtoken';
import { DataStore } from '../data/store.js';
import { verifyAdmin } from '../middleware/auth.js';
import { getJwtSecret } from '../config/authConfig.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Admin Login (Rate-limited)
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@balajiconsultancy.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim() || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        email: adminEmail,
        name: 'Balaji Management',
        role: 'Super Admin'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Profile verification
router.get('/me', verifyAdmin, (req, res) => {
  res.json({
    success: true,
    admin: {
      email: req.admin.email,
      role: 'Super Admin'
    }
  });
});

// Dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const stats = await DataStore.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

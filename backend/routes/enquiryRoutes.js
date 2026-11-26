import express from 'express';
import { DataStore } from '../data/store.js';
import { verifyAdmin } from '../middleware/auth.js';
import { publicPostLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// POST new enquiry (Public, rate-limited)
router.post('/', publicPostLimiter, async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, phone number, and message are required' });
    }
    const enquiry = await DataStore.createEnquiry(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Thank you! Your enquiry has been received. Our Balaji team will contact you shortly.',
      data: enquiry 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all enquiries (Admin)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const enquiries = await DataStore.getEnquiries();
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update enquiry status (Admin)
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await DataStore.updateEnquiryStatus(req.params.id, status);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Status updated', data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

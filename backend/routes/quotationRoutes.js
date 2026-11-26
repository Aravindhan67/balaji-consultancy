import express from 'express';
import { DataStore } from '../data/store.js';
import { verifyAdmin } from '../middleware/auth.js';
import { publicPostLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// POST new quotation request (Public, rate-limited)
router.post('/', publicPostLimiter, async (req, res) => {
  try {
    const { name, phone, type, vehicleType } = req.body;
    if (!name || !phone || !type || !vehicleType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, phone, request type, and vehicle type are required' 
      });
    }
    const quotation = await DataStore.createQuotation(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Quotation request submitted! Our valuation specialist will review and call you within 2 business hours.',
      data: quotation 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all quotations (Admin)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const quotations = await DataStore.getQuotations();
    res.json({ success: true, count: quotations.length, data: quotations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update quotation status (Admin)
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const quotation = await DataStore.updateQuotationStatus(req.params.id, status);
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }
    res.json({ success: true, message: 'Status updated', data: quotation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

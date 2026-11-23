import express from 'express';
import { DataStore } from '../data/store.js';

const router = express.Router();

// GET all customer reviews (Public)
router.get('/', async (req, res) => {
  try {
    const reviews = await DataStore.getReviews();
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new customer review (Public)
router.post('/', async (req, res) => {
  try {
    const { name, comment, rating, role, location, vehicleOrService } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Your name is required' });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Please share your review or experience' });
    }
    const numRating = Number(rating) || 5;
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars' });
    }

    const review = await DataStore.createReview({
      name: name.trim(),
      role: (role && role.trim()) || 'Verified Customer',
      location: (location && location.trim()) || '',
      vehicleOrService: (vehicleOrService && vehicleOrService.trim()) || '',
      rating: numRating,
      comment: comment.trim(),
      verified: true
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your verified review has been submitted and added.',
      data: review
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

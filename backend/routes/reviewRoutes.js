import express from 'express';
import { DataStore } from '../data/store.js';
import { publicPostLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// GET all customer reviews (Public, optional filter by productId)
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    let reviews = await DataStore.getReviews();
    if (productId) {
      reviews = reviews.filter(r => r.productId === productId || !r.productId);
    }
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new customer review (Public, rate-limited)
router.post('/', publicPostLimiter, async (req, res) => {
  try {
    const { name, comment, rating, role, location, vehicleOrService, productId } = req.body;
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
      productId: (productId && productId.trim()) || null,
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

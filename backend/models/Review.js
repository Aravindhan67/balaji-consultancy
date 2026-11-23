import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: 'Verified Customer'
  },
  location: {
    type: String,
    default: ''
  },
  vehicleOrService: {
    type: String,
    default: ''
  },
  productId: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  verified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Review = mongoose.model('Review', reviewSchema);

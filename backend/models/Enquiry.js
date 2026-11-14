import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  city: { type: String, default: '' },
  interest: { 
    type: String, 
    default: 'general',
    enum: ['buy_tractor', 'buy_car', 'buy_spare_part', 'consultancy', 'general']
  },
  productId: { type: String, default: '' },
  productTitle: { type: String, default: '' },
  message: { type: String, required: true },
  status: { 
    type: String, 
    default: 'new',
    enum: ['new', 'contacted', 'closed']
  }
}, {
  timestamps: true
});

export const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);

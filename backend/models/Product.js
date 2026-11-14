import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['tractor', 'car', 'spare_part'] 
  },
  subCategory: { type: String, default: 'second_hand_vehicle' },
  brand: { type: String, required: true },
  modelYear: { type: Number, default: new Date().getFullYear() },
  price: { type: Number, required: true },
  condition: { 
    type: String, 
    default: 'Excellent',
    enum: ['Like New', 'Excellent', 'Good', 'Certified Refurbished']
  },
  kmOrHours: { type: String, default: '' },
  fuelType: { type: String, default: 'Diesel' },
  rtoPassing: { type: String, default: 'Verified All-India NOC / State RTO' },
  ownership: { type: String, default: '1st Owner' },
  hpPower: { type: String, default: '' },
  partNumber: { type: String, default: '' },
  fitment: { type: String, default: '' },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  status: { 
    type: String, 
    default: 'available',
    enum: ['available', 'reserved', 'sold']
  },
  description: { type: String, default: '' },
  specs: { type: Map, of: String, default: {} },
  location: { type: String, default: 'Balaji Yard, Tamil Nadu / All India Delivery' }
}, {
  timestamps: true
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

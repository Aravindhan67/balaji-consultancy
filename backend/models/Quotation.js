import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  city: { type: String, default: '' },
  type: { 
    type: String, 
    required: true,
    enum: ['sell_vehicle', 'buy_quotation', 'spare_parts_bulk', 'consultancy_valuation']
  },
  vehicleType: { 
    type: String, 
    required: true,
    enum: ['tractor', 'car', 'spare_part', 'both']
  },
  brand: { type: String, default: '' },
  modelName: { type: String, default: '' },
  year: { type: Number, default: new Date().getFullYear() },
  expectedPrice: { type: String, default: '' },
  condition: { type: String, default: 'Good' },
  notes: { type: String, default: '' },
  photos: [{ type: String }],
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'evaluated', 'deal_made', 'rejected']
  }
}, {
  timestamps: true
});

export const Quotation = mongoose.models.Quotation || mongoose.model('Quotation', quotationSchema);

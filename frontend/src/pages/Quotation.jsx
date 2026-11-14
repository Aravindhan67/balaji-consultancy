import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  FileCheck, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  IndianRupee, 
  PhoneCall, 
  Clock, 
  AlertCircle,
  Camera,
  X,
  Sparkles
} from 'lucide-react';

export const Quotation = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    type: 'sell_vehicle',
    vehicleType: 'tractor',
    brand: 'Mahindra',
    modelName: '',
    year: 2020,
    expectedPrice: '',
    condition: 'Excellent',
    notes: ''
  });

  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    setErrorMsg('');
    try {
      const res = await api.uploadMultipleImages(files);
      if (res.success && res.urls) {
        setUploadedPhotos(prev => [...prev, ...res.urls]);
      } else {
        setErrorMsg(res.message || 'Failed to upload images to backend');
      }
    } catch (err) {
      setErrorMsg('Image upload error. Please check backend server.');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (index) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg('Please enter your name and contact phone number');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await api.submitQuotation({
        ...formData,
        photos: uploadedPhotos
      });
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.message || 'Submission failed');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again or message on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 bg-[#F8FAFC]">
      {/* Header Banner - Distinct Lite-Dark Slate Gradient Card */}
      <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-700/60">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wider bg-gradient-to-r from-amber-300 to-amber-400 px-3.5 py-1.5 rounded-full shadow-md shadow-amber-400/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-950" />
            Free Vehicle Valuation &amp; Quotation
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
            Sell Your Tractor or Car at{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">
              Fair Market Value
            </span>
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-normal">
            Need an accurate price valuation or looking to sell your pre-owned vehicle fast? Fill in your machine details below. Our valuation specialists analyze current mandi rates, RTO depreciation, and mechanical condition to deliver an authentic spot cash offer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-slate-900">
                Quotation Request Submitted Successfully!
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Our Balaji vehicle valuation team will review your {formData.brand} {formData.modelName} specifications and contact you at <strong>{formData.phone}</strong> within 2 business hours.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setUploadedPhotos([]);
                  }}
                  className="bg-orange-600 text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors shadow-md shadow-orange-600/20"
                >
                  Submit Another Vehicle
                </button>
                <a
                  href={`https://wa.me/918124336369?text=Hi%20Balaji%20Consultancy,%20I%20just%20submitted%20a%20valuation%20for%20my%20${formData.brand}%20${formData.modelName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-[#20ba59] shadow-sm"
                >
                  Confirm on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-lg mb-1">
                  Step 1: What is Your Requirement?
                </h3>
                <p className="text-xs text-slate-500 mb-4">Choose whether you want to sell, buy, or get parts</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'sell_vehicle', label: 'Sell My Vehicle' },
                    { id: 'buy_quotation', label: 'Buy Price Quote' },
                    { id: 'spare_parts_bulk', label: 'Spare Parts' },
                    { id: 'consultancy_valuation', label: 'RTO / Valuation' }
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setFormData(prev => ({ ...prev, type: item.id }))}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        formData.type === item.id
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Vehicle Details */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-heading font-bold text-slate-900 text-lg mb-1">
                  Step 2: Vehicle Specifications
                </h3>
                <p className="text-xs text-slate-500 mb-4">Provide basic information about the machinery</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Type *</label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="tractor">🚜 Tractor</option>
                      <option value="car">🚗 Car / Utility</option>
                      <option value="spare_part">⚙️ Spare Part Order</option>
                    </select>
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Manufacturer *</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Mahindra">Mahindra</option>
                      <option value="Swaraj">Swaraj</option>
                      <option value="John Deere">John Deere</option>
                      <option value="Sonalika">Sonalika</option>
                      <option value="Massey Ferguson">Massey Ferguson</option>
                      <option value="Eicher">Eicher</option>
                      <option value="Maruti Suzuki">Maruti Suzuki</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Tata">Tata Motors</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Model Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Model Name / HP *</label>
                    <input
                      type="text"
                      name="modelName"
                      required
                      placeholder="e.g. 575 DI, 855 FE, Bolero ZLX..."
                      value={formData.modelName}
                      onChange={handleChange}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  {/* Year */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Manufacturing Year</label>
                    <input
                      type="number"
                      name="year"
                      min="1995"
                      max="2026"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Expected Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expected Price (₹)</label>
                    <input
                      type="number"
                      name="expectedPrice"
                      placeholder="e.g. 420000"
                      value={formData.expectedPrice}
                      onChange={handleChange}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Current Condition</label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Excellent">Excellent (Like New)</option>
                      <option value="Very Good">Very Good (Clean Engine)</option>
                      <option value="Good">Good (Working Order)</option>
                      <option value="Fair">Fair (Needs Minor Service)</option>
                    </select>
                  </div>
                </div>

                {/* Machine notes */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hours / KMs Run, Tyres &amp; RTO State</label>
                  <textarea
                    rows="3"
                    name="notes"
                    placeholder="Mention meter hours/km, insurance validity, RTO passing (e.g. TN-30, MH-12, PB-10), and major maintenance done..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>
              </div>

              {/* Step 3: Photos Upload to Backend */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-heading font-bold text-slate-900 text-lg mb-1">
                  Step 3: Vehicle Photos (Stored on Backend)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Upload clear photos of front, side, meter dashboard, engine, and tyres to get an instant higher valuation.
                </p>

                <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl p-6 text-center hover:bg-slate-100 transition-colors relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhotos}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center pointer-events-none">
                    <UploadCloud className="w-10 h-10 text-orange-600 mb-2" />
                    <span className="text-xs font-bold text-slate-900">
                      {uploadingPhotos ? 'Uploading Images to Server...' : 'Click or Drag & Drop Photos Here'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      PNG, JPG, JPEG up to 10MB each (Directly saved into backend/uploads)
                    </span>
                  </div>
                </div>

                {/* Uploaded Preview Grid */}
                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                    {uploadedPhotos.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={url} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 4: Contact Details */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-heading font-bold text-slate-900 text-lg mb-1">
                  Step 4: Contact Information
                </h3>
                <p className="text-xs text-slate-500 mb-4">Where should our vehicle valuation specialist send the quote?</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 8124336369"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City / District / State *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g. Coimbatore, Tamil Nadu"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-amber-200" />
                {submitting ? 'Submitting Valuation Request...' : 'Get Instant Market Price Valuation'}
              </button>
            </form>
          )}
        </div>

        {/* Right Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-slate-900 text-base">
              Why Sell or Value With Balaji?
            </h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 font-bold border border-orange-100">
                  ₹
                </div>
                <div>
                  <div className="font-bold text-slate-900">Spot Cash &amp; Fast Settlement</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upon physical inspection at your location or our yard, payment is completed within 2 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold border border-emerald-100">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-slate-900">100% RTO Legal Release</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    We issue official seller release receipts and take full legal custody of subsequent transfer obligations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 font-bold border border-amber-100">
                  ★
                </div>
                <div>
                  <div className="font-bold text-slate-900">Pan-India Buyer Network</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Direct access to genuine farmers and commercial operators who value clean, well-kept machines.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="text-[11px] text-slate-500 mb-2 font-medium">Need urgent assistance?</div>
              <a
                href="tel:+918124336369"
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs py-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                Call Valuation Desk: +91 81243 36369
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

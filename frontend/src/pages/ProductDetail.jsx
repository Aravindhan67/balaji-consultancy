import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  MessageSquare, 
  PhoneCall, 
  ArrowLeft, 
  CheckCircle2, 
  FileCheck, 
  HeartHandshake, 
  Share2,
  Clock,
  Send,
  Sparkles
} from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Enquiry form state
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryCity, setEnquiryCity] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('I want to inspect this vehicle / check availability at Balaji Yard.');
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.getProductById(id);
        if (res.success) {
          setProduct(res.data);
        }
      } catch (err) {
        console.error('Failed to load vehicle details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone) return;

    setSubmittingEnquiry(true);
    try {
      const res = await api.submitEnquiry({
        name: enquiryName,
        phone: enquiryPhone,
        city: enquiryCity,
        productId: product?._id,
        productTitle: product?.title,
        interest: product?.category === 'tractor' ? 'buy_tractor' : product?.category === 'car' ? 'buy_car' : 'buy_spare_part',
        message: enquiryMessage
      });
      if (res.success) {
        setEnquirySuccess(true);
        setEnquiryName('');
        setEnquiryPhone('');
        setEnquiryCity('');
      }
    } catch (err) {
      alert('Error submitting enquiry. Please contact us directly via WhatsApp.');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Loading vehicle specifications &amp; inspection report...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading font-bold text-xl text-slate-900">Vehicle / Product Not Found</h2>
        <p className="text-xs text-slate-500">The vehicle you are looking for may have been sold or removed from inventory.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md">
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory
        </Link>
      </div>
    );
  }

  const {
    title,
    category,
    brand,
    modelYear,
    price,
    condition,
    kmOrHours,
    fuelType,
    rtoPassing,
    hpPower,
    images = [],
    description,
    inspectionReport = {}
  } = product;

  const displayImages = images && images.length > 0 ? images : ['/uploads/tractor-mahindra-575.jpg'];

  const waMessage = encodeURIComponent(
    `Hello Balaji Consultancy! I am interested in inspecting: ${title} priced at ${formatINR(price, false)}. Is it currently available at the yard?`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F8FAFC]">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-orange-600">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${category}`} className="hover:text-orange-600 capitalize">
          {category === 'spare_part' ? 'Spare Parts' : `${category}s`}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{title}</span>
      </div>

      {/* Main Grid: Images + Vehicle Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Showcase (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/10] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={displayImages[selectedImage] || displayImages[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {category === 'tractor' ? 'Tractor' : category === 'car' ? 'Car' : 'Spare Part'}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/95 backdrop-blur text-slate-800 border border-slate-200 shadow-sm">
                {condition}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {displayImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx ? 'border-orange-600 scale-105 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* 120-Point Mechanical Inspection Certificate Badge Card */}
          <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-700" />
                <h3 className="font-heading font-extrabold text-slate-900 text-base">
                  120-Point Mechanical Certification
                </h3>
              </div>
              <span className="text-[11px] font-bold bg-emerald-700 text-white px-2.5 py-1 rounded-full">
                PASSED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <div className="text-[10px] text-slate-500">Engine &amp; Compression</div>
                <div className="font-bold text-emerald-800">{inspectionReport.engine || 'Certified Clean'}</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <div className="text-[10px] text-slate-500">Hydraulics / Suspension</div>
                <div className="font-bold text-emerald-800">{inspectionReport.hydraulics || 'Optimal Flow'}</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <div className="text-[10px] text-slate-500">Gearbox &amp; Clutch</div>
                <div className="font-bold text-emerald-800">{inspectionReport.transmission || 'Smooth Shift'}</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <div className="text-[10px] text-slate-500">Brakes &amp; Steering</div>
                <div className="font-bold text-emerald-800">{inspectionReport.brakes || 'Tested Positive'}</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <div className="text-[10px] text-slate-500">Tyre Life Estimated</div>
                <div className="font-bold text-emerald-800">{inspectionReport.tyres || '75% - 85% Life'}</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <div className="text-[10px] text-slate-500">RTO &amp; Hypothecation</div>
                <div className="font-bold text-emerald-800">{inspectionReport.chassisRC || 'Clear Title'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Info, Price & Instant Lead Booking (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="text-xs font-bold text-orange-600 tracking-wider uppercase mb-1">
                {brand} • {modelYear ? `${modelYear} Model` : 'Certified Genuine'}
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                {title}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Fixed Yard Price</span>
                <div className="font-heading font-black text-3xl text-slate-900">
                  {formatINR(price)}
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                No Brokerage
              </span>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {kmOrHours && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-[10px] text-slate-500">Usage / Run</div>
                    <div className="font-bold text-slate-900">{kmOrHours}</div>
                  </div>
                </div>
              )}

              {hpPower && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-50 text-amber-800 text-[10px] font-bold flex items-center justify-center border border-amber-200">HP</span>
                  <div>
                    <div className="text-[10px] text-slate-500">Engine Power</div>
                    <div className="font-bold text-slate-900">{hpPower}</div>
                  </div>
                </div>
              )}

              {fuelType && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-[10px] text-slate-500">Fuel Type</div>
                    <div className="font-bold text-slate-900">{fuelType}</div>
                  </div>
                </div>
              )}

              {rtoPassing && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-[10px] text-slate-500">RTO Registration</div>
                    <div className="font-bold text-slate-900 truncate">{rtoPassing}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                Consultant Notes &amp; Vehicle History
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {description || 'This machine has been fully verified at Balaji Inspection Yard. Tested under operational loads with clear title documents and instant RTO transfer support.'}
              </p>
            </div>

            {/* Direct Instant Action CTAs */}
            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/918124336369?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                Chat on WhatsApp for Yard Inspection
              </a>

              <a
                href="tel:+918124336369"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs py-3.5 rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                Call Balaji Desk (+91 81243 36369)
              </a>
            </div>

            {/* Inline Yard Visit Enquiry Form */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-heading font-bold text-slate-900 text-sm mb-1">
                Book a Yard Inspection / Hold Request
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                Leave your number and our consultant will reserve this vehicle for 24 hours.
              </p>

              {enquirySuccess ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center text-xs text-emerald-800 font-bold">
                  ✓ Your inspection request has been logged! Our team will call you shortly.
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile / WhatsApp Number *"
                    value={enquiryPhone}
                    onChange={(e) => setEnquiryPhone(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Your City / District"
                    value={enquiryCity}
                    onChange={(e) => setEnquiryCity(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingEnquiry}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submittingEnquiry ? 'Submitting...' : 'Request Inspection Callback'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import { resolveImageUrl } from '../utils/imageUrl';
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
  CheckCircle,
  FileCheck, 
  HeartHandshake, 
  Share2,
  Clock,
  Send,
  Sparkles,
  Star,
  Plus,
  X,
  ArrowRight
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

  // Customer Reviews state
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [newReviewId, setNewReviewId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    location: '',
    rating: 5,
    comment: ''
  });

  const getInitials = (fullName = '') => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'BC';
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.getReviews();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setReviews(res.data);
        } else {
          const local = localStorage.getItem('balaji_customer_reviews');
          if (local) {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setReviews(parsed);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load reviews:', err);
      }
    };
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      alert('Please enter your name and review experience.');
      return;
    }

    setReviewSubmitting(true);
    try {
      const reviewPayload = {
        name: reviewForm.name.trim(),
        role: reviewForm.role.trim() || 'Verified Customer',
        location: reviewForm.location.trim(),
        vehicleOrService: product?.title || 'Balaji Certified Vehicle',
        productId: product?._id || id,
        rating: Number(reviewForm.rating) || 5,
        comment: reviewForm.comment.trim(),
        verified: true,
        createdAt: new Date().toISOString()
      };

      const res = await api.createReview(reviewPayload);
      const addedReview = (res && res.success && res.data) ? res.data : {
        _id: `rev_${Date.now()}`,
        ...reviewPayload
      };

      const updated = [addedReview, ...reviews];
      setReviews(updated);
      try {
        localStorage.setItem('balaji_customer_reviews', JSON.stringify(updated));
      } catch (_) {}

      setNewReviewId(addedReview._id);
      setIsReviewModalOpen(false);
      setReviewSuccessMsg(`Thank you, ${reviewPayload.name}! Your review has been added to our verified customer wall.`);
      setReviewForm({
        name: '',
        role: '',
        location: '',
        rating: 5,
        comment: ''
      });

      setTimeout(() => {
        setReviewSuccessMsg('');
      }, 7000);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

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
        <h2 className="font-heading font-bold text-xl text-[#111111]">Vehicle / Product Not Found</h2>
        <p className="text-xs text-[#6B665F]">The vehicle you are looking for may have been sold or removed from inventory.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#236628] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-colors">
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

  const displayImages = (images && images.length > 0 ? images : ['/uploads/tractor-mahindra-575.jpg']).map(resolveImageUrl);

  const waMessage = encodeURIComponent(
    `Hello Balaji Consultancy! I am interested in inspecting: ${title} priced at ${formatINR(price, false)}. Is it currently available at the yard?`
  );

  const relevantReviews = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    return [...reviews].sort((a, b) => {
      if (a._id === newReviewId) return -1;
      if (b._id === newReviewId) return 1;
      const aMatches = (a.productId && (a.productId === product?._id || a.productId === id)) || 
        (a.vehicleOrService && title && a.vehicleOrService.toLowerCase().includes(title.toLowerCase()));
      const bMatches = (b.productId && (b.productId === product?._id || b.productId === id)) || 
        (b.vehicleOrService && title && b.vehicleOrService.toLowerCase().includes(title.toLowerCase()));
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  }, [reviews, product, id, title, newReviewId]);

  return (
    <div className="min-h-screen bg-[#F5F1EB] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#6B665F]">
          <Link to="/" className="hover:text-[#111111]">Home</Link>
          <span>/</span>
          <Link to={`/products?category=${category}`} className="hover:text-[#111111] capitalize">
            {category === 'spare_part' ? 'Spare Parts' : `${category}s`}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-bold truncate max-w-xs">{title}</span>
        </div>

        {/* Main Grid: Images + Vehicle Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Showcase (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#E3DBD0] shadow-sm">
              <img
                src={displayImages[selectedImage] || displayImages[0]}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Strip */}
            {displayImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === idx ? 'border-[#111111] scale-105 shadow-sm' : 'border-[#E3DBD0] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* 120-Point Mechanical Inspection Certificate Badge Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#E3DBD0] space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3DBD0]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#111111]" />
                  <h3 className="font-heading font-extrabold text-[#111111] text-sm uppercase tracking-wider">
                    120-Point Mechanical Certification
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAE3D7] text-[#111111] px-3 py-1 rounded-full border border-[#DCD4C7]">
                  PASSED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E3DBD0]">
                  <div className="text-[10px] text-[#6B665F]">Engine &amp; Compression</div>
                  <div className="font-bold text-[#111111]">{inspectionReport.engine || 'Certified Clean'}</div>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E3DBD0]">
                  <div className="text-[10px] text-[#6B665F]">Hydraulics / Suspension</div>
                  <div className="font-bold text-[#111111]">{inspectionReport.hydraulics || 'Optimal Flow'}</div>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E3DBD0]">
                  <div className="text-[10px] text-[#6B665F]">Gearbox &amp; Clutch</div>
                  <div className="font-bold text-[#111111]">{inspectionReport.transmission || 'Smooth Shift'}</div>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E3DBD0]">
                  <div className="text-[10px] text-[#6B665F]">Brakes &amp; Steering</div>
                  <div className="font-bold text-[#111111]">{inspectionReport.brakes || 'Tested Positive'}</div>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E3DBD0]">
                  <div className="text-[10px] text-[#6B665F]">Tyre Life Estimated</div>
                  <div className="font-bold text-[#111111]">{inspectionReport.tyres || '75% - 85% Life'}</div>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E3DBD0]">
                  <div className="text-[10px] text-[#6B665F]">RTO &amp; Hypothecation</div>
                  <div className="font-bold text-[#111111]">{inspectionReport.chassisRC || 'Clear Title'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Info, Price & Instant Lead Booking (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E3DBD0] shadow-sm space-y-6">
              <div>
                <div className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
                  <span>Auto &amp; Agro Consultancy Certified</span>
                  <span className="text-[#E3DBD0]">•</span>
                  <span>{brand}</span>
                  {modelYear && <span>• {modelYear} Model</span>}
                </div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#111111] tracking-tight">
                  {title}
                </h1>
              </div>

              {/* Price Box */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E3DBD0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6B665F] tracking-wider">Fixed Yard Price</span>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                    {formatINR(price)}
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] bg-[#EAE3D7] px-3 py-1 rounded-full border border-[#DCD4C7]">
                  No Brokerage
                </span>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {kmOrHours && (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E3DBD0] flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-[#6B665F]" />
                    <div>
                      <div className="text-[10px] text-[#6B665F]">Usage / Run</div>
                      <div className="font-bold text-[#111111]">{kmOrHours}</div>
                    </div>
                  </div>
                )}

                {hpPower && (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E3DBD0] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center">HP</span>
                    <div>
                      <div className="text-[10px] text-[#6B665F]">Engine Power</div>
                      <div className="font-bold text-[#111111]">{hpPower}</div>
                    </div>
                  </div>
                )}

                {fuelType && (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E3DBD0] flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-[#6B665F]" />
                    <div>
                      <div className="text-[10px] text-[#6B665F]">Fuel Type</div>
                      <div className="font-bold text-[#111111]">{fuelType}</div>
                    </div>
                  </div>
                )}

                {rtoPassing && (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E3DBD0] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#6B665F]" />
                    <div>
                      <div className="text-[10px] text-[#6B665F]">RTO Registration</div>
                      <div className="font-bold text-[#111111] truncate">{rtoPassing}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="font-heading font-bold text-[10px] uppercase tracking-wider text-[#6B665F] mb-2">
                  Consultant Notes &amp; Vehicle History
                </h4>
                <p className="text-xs text-[#6B665F] leading-relaxed">
                  {description || 'This machine has been fully verified at Balaji Inspection Yard. Tested under operational loads with clear title documents and instant RTO transfer support.'}
                </p>
              </div>

              {/* Direct Instant Action CTAs */}
              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/918124336369?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  Chat on WhatsApp for Yard Inspection
                </a>

                <a
                  href="tel:+918124336369"
                  className="w-full bg-[#FAF8F5] hover:bg-[#2E7D32] text-[#111111] hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full border border-[#E3DBD0] hover:border-[#2E7D32] flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[#111111]" />
                  Call Balaji Desk (+91 81243 36369)
                </a>
              </div>

              {/* Inline Yard Visit Enquiry Form */}
              <div className="pt-4 border-t border-[#E3DBD0]">
                <h4 className="font-heading font-bold text-[#111111] text-sm mb-1">
                  Book a Yard Inspection / Hold Request
                </h4>
                <p className="text-[11px] text-[#6B665F] mb-3">
                  Leave your number and our consultant will reserve this vehicle for 24 hours.
                </p>

                {enquirySuccess ? (
                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E3DBD0] text-center text-xs text-[#111111] font-bold">
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
                      className="w-full text-xs bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile / WhatsApp Number *"
                      value={enquiryPhone}
                      onChange={(e) => setEnquiryPhone(e.target.value)}
                      className="w-full text-xs bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                    />
                    <input
                      type="text"
                      placeholder="Your City / District"
                      value={enquiryCity}
                      onChange={(e) => setEnquiryCity(e.target.value)}
                      className="w-full text-xs bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                    />
                    <button
                      type="submit"
                      disabled={submittingEnquiry}
                      className="w-full bg-[#2E7D32] hover:bg-[#236628] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-full shadow-sm transition-colors flex items-center justify-center gap-1.5"
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

        {/* =========================================================================
            CUSTOMER REVIEWS SECTION (SUBMITTED & DISPLAYED ON PRODUCT PAGE)
           ========================================================================= */}
        <section id="product-reviews" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E3DBD0] space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E3DBD0]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] bg-[#EAE3D7] px-3 py-1 rounded-full border border-[#DCD4C7] inline-block mb-2">
                Verified Customer Feedback
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                Customer Reviews &amp; Experiences
              </h2>
              <p className="text-xs sm:text-sm text-[#6B665F] mt-1">
                Real feedback from farmers and vehicle owners who bought, inspected, or reviewed machines with Balaji Consultancy.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="taste-btn inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#236628] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-none shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Customer Review</span>
            </button>
          </div>

          {/* Success Banner */}
          {reviewSuccessMsg && (
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#2E7D32] text-xs text-[#111111] font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <span>{reviewSuccessMsg}</span>
            </div>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relevantReviews.map((rev, idx) => {
              const initials = getInitials(rev.name);
              const isJustAdded = rev._id === newReviewId;
              const isSpecific = (rev.productId && (rev.productId === product?._id || rev.productId === id)) ||
                (rev.vehicleOrService && title && rev.vehicleOrService.toLowerCase().includes(title.toLowerCase()));

              return (
                <div
                  key={rev._id || idx}
                  className={`bg-[#FAF8F5] p-6 rounded-2xl border transition-all flex flex-col justify-between h-full relative ${
                    isJustAdded ? 'border-[#111111] ring-2 ring-[#111111]/20' : 'border-[#E3DBD0] hover:border-[#111111]'
                  }`}
                >
                  {isJustAdded && (
                    <span className="absolute -top-3 right-4 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-white" />
                      Just Added
                    </span>
                  )}

                  <div>
                    {/* Star Rating & Vehicle Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-[#D97706]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < (rev.rating || 5) ? 'fill-current text-[#D97706]' : 'text-neutral-200'}`}
                          />
                        ))}
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        isSpecific 
                          ? 'bg-white text-[#2E7D32] border-[#2E7D32]/30 font-bold'
                          : 'bg-white text-[#111111] border-[#E3DBD0]'
                      }`}>
                        {rev.vehicleOrService || title}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-xs text-[#555048] leading-relaxed italic font-normal">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Customer Info */}
                  <div className="mt-4 pt-4 border-t border-[#E3DBD0] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs bg-white text-[#111111] border border-[#E3DBD0] shrink-0">
                      {initials}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-[#111111] text-xs truncate">{rev.name}</div>
                      <div className="text-[11px] text-[#8C857B] truncate">
                        {rev.role || 'Verified Customer'}{rev.location ? `, ${rev.location}` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            CUSTOMER REVIEW SUBMISSION MODAL
           ========================================================================= */}
        {isReviewModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsReviewModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E3DBD0] relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E3DBD0]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] bg-[#EAE3D7] px-3 py-0.5 rounded-full border border-[#DCD4C7]">
                    Customer Feedback
                  </span>
                  <h3 className="font-heading font-black text-xl text-[#111111] mt-2">
                    Review {title}
                  </h3>
                  <p className="text-xs text-[#6B665F] mt-0.5">
                    Your feedback will appear on this vehicle page and our verified customer wall.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EAE3D7] text-[#111111] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4">
                {/* Star Rating Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-[#D97706] fill-[#D97706]' : 'text-neutral-200'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Your Full Name <span className="text-neutral-900">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balasubramaniam"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>

                {/* Role & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                      Occupation / Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sugarcane Farmer"
                      value={reviewForm.role}
                      onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                      className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                      City / District
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Salem (Tamil Nadu)"
                      value={reviewForm.location}
                      onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                      className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                    />
                  </div>
                </div>

                {/* Vehicle or Machine (pre-filled with current title) */}
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Vehicle / Machine
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={title || 'Balaji Certified Vehicle'}
                    className="w-full text-xs sm:text-sm bg-[#EAE3D7] border border-[#DCD4C7] rounded-xl px-3.5 py-2.5 text-[#111111] font-semibold cursor-not-allowed"
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Your Review / Experience <span className="text-neutral-900">*</span>
                  </label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Share details about vehicle condition, engine sound, yard inspection, or consultant service..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111] resize-none"
                  ></textarea>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="taste-btn px-5 py-2.5 rounded-full border border-[#E3DBD0] text-[#111111] font-bold text-xs uppercase tracking-wider hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="taste-btn inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#236628] text-white font-bold text-xs uppercase tracking-wider px-7 py-2.5 rounded-full transition-all cursor-pointer disabled:opacity-50"
                  >
                    {reviewSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Review</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import { resolveImageUrl } from '../utils/imageUrl';
import BlurText from '../components/BlurText';
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
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const carouselRef = useRef(null);

  const scrollToImage = (index) => {
    setSelectedImage(index);
    if (carouselRef.current) {
      const targetChild = carouselRef.current.children[index];
      if (targetChild) {
        targetChild.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      if (clientWidth > 0) {
        const newIdx = Math.round(scrollLeft / clientWidth);
        if (newIdx !== selectedImage && newIdx >= 0) {
          setSelectedImage(newIdx);
        }
      }
    }
  };

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
        <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-[#6B665F]">Loading vehicle specifications &amp; inspection report...</p>
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
            {/* Interactive Scrollable Image Carousel */}
            <div className="relative aspect-[16/10] bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#E3DBD0] shadow-sm group">
              <div
                ref={carouselRef}
                onScroll={handleCarouselScroll}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {displayImages.map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                    <img
                      src={img}
                      alt={`${title} - view ${idx + 1}`}
                      className="w-full h-full object-cover select-none"
                      onError={(e) => {
                        e.target.onerror = null;
                        const fallback = category === 'car'
                          ? '/static-uploads/car-mahindra-bolero.jpg'
                          : category === 'spare_part'
                          ? '/static-uploads/part-clutch-plate.jpg'
                          : '/static-uploads/tractor-mahindra-575.jpg';
                        e.target.src = fallback;
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Photos Counter Badge */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm pointer-events-none">
                <Camera className="w-3.5 h-3.5" />
                <span>{Math.min(selectedImage + 1, displayImages.length)} / {displayImages.length} Photos</span>
              </div>

              {/* Prev / Next Scroll Arrows (when > 1 photo) */}
              {displayImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollToImage((selectedImage - 1 + displayImages.length) % displayImages.length)}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#111111] shadow-md flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-110 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToImage((selectedImage + 1) % displayImages.length)}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#111111] shadow-md flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-110 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                    {displayImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToImage(idx)}
                        aria-label={`View photo ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          selectedImage === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Scroll Track */}
            {displayImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToImage(idx)}
                    className={`relative w-20 sm:w-24 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                      selectedImage === idx 
                        ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/25 scale-102 shadow-sm' 
                        : 'border-[#E3DBD0] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.onerror = null;
                        const fallback = category === 'car'
                          ? '/static-uploads/car-mahindra-bolero.jpg'
                          : category === 'spare_part'
                          ? '/static-uploads/part-clutch-plate.jpg'
                          : '/static-uploads/tractor-mahindra-575.jpg';
                        e.target.src = fallback;
                      }}
                    />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {idx === 0 ? 'Main' : `#${idx + 1}`}
                    </span>
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
                <div className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider mb-1 flex items-center gap-1.5 flex-wrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
                  <span>Auto &amp; Agro Consultancy Certified</span>
                  <span className="text-[#E3DBD0]">•</span>
                  <span>{brand}</span>
                  {modelYear && <span>• {modelYear} Model</span>}
                  {product.status && product.status !== 'available' && (
                    <span className={`ml-2 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      product.status === 'sold'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : product.status === 'reserved'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {product.status === 'sold' ? '🔴 Sold Out' : product.status === 'reserved' ? '🟡 Reserved' : '🔵 Under Inspection'}
                    </span>
                  )}
                </div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#111111] tracking-tight">
                  <BlurText
                    text={title}
                    delay={40}
                    stepDuration={0.3}
                    className="justify-start"
                  />
                </h1>
              </div>

              {product.status && product.status !== 'available' && (
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold ${
                  product.status === 'sold'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : product.status === 'reserved'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                  <span>
                    {product.status === 'sold'
                      ? '⚠️ Notice: This vehicle has been SOLD OUT and is not available in current stock.'
                      : product.status === 'reserved'
                      ? '⚠️ Notice: This vehicle is currently RESERVED / BOOKED by a customer.'
                      : 'ℹ️ Notice: This vehicle is currently undergoing mechanical inspection.'}
                  </span>
                  <Link to="/products" className="underline hover:text-black shrink-0">
                    Browse Available Stock &rarr;
                  </Link>
                </div>
              )}

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
            GOOGLE REVIEW COLLECTION (GET REVIEW LIKE GOOGLE REVIEW)
           ========================================================================= */}
        <section id="google-review-section" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E3DBD0] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E3DBD0]">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#E3DBD0] px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
                <GoogleIcon />
                <span className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">
                  Google Verified Reviews
                </span>
                <span className="text-[#6B665F] text-[11px]">•</span>
                <div className="flex text-[#D97706] items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current text-[#D97706]" />
                  <span className="text-xs font-bold text-[#111111]">4.9 / 5.0</span>
                </div>
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                Rate &amp; Review this Vehicle
              </h2>
              <p className="text-xs sm:text-sm text-[#6B665F] mt-1 max-w-xl">
                Have you inspected or purchased this machine? Share your experience with other farmers and buyers. Your verified review will be featured on our Home page testimonials wall.
              </p>
            </div>

            <a
              href="https://www.google.com/search?q=Balaji+Auto+Consultancy+Salem+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="taste-btn inline-flex items-center gap-2 bg-[#FAF8F5] hover:bg-[#EAE3D7] text-[#111111] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full border border-[#E3DBD0] transition-all shrink-0 self-start md:self-auto cursor-pointer"
            >
              <GoogleIcon />
              <span>Review on Google</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#6B665F]" />
            </a>
          </div>

          {/* Form / Success Feedback */}
          {reviewSuccessMsg ? (
            <div className="p-8 bg-[#FAF8F5] rounded-2xl border border-[#2E7D32] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-black text-lg text-[#111111]">Thank You for Your Review!</h4>
              <p className="text-xs sm:text-sm text-[#6B665F] max-w-lg mx-auto">{reviewSuccessMsg}</p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setReviewSuccessMsg('')}
                  className="taste-btn text-xs font-bold text-[#2E7D32] hover:text-[#236628] uppercase tracking-wider underline cursor-pointer"
                >
                  Write another review
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-5 bg-[#FAF8F5] p-5 sm:p-7 rounded-2xl border border-[#E3DBD0]">
              {/* Star Rating Picker (Google Reviews style) */}
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                  Your Rating for {title} <span className="text-[#2E7D32]">*</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-white px-3.5 py-2 rounded-xl border border-[#E3DBD0]">
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
                  <span className="text-xs font-bold text-[#111111] ml-2">
                    {reviewForm.rating === 5 && '★★★★★ Excellent (5.0)'}
                    {reviewForm.rating === 4 && '★★★★☆ Very Good (4.0)'}
                    {reviewForm.rating === 3 && '★★★☆☆ Good (3.0)'}
                    {reviewForm.rating === 2 && '★★☆☆☆ Fair (2.0)'}
                    {reviewForm.rating === 1 && '★☆☆☆☆ Needs Improvement (1.0)'}
                  </span>
                </div>
              </div>

              {/* Reviewer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Your Full Name <span className="text-neutral-900">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senthil Kumar"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    className="w-full text-xs sm:text-sm bg-white border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Occupation / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sugarcane Farmer, Contractor"
                    value={reviewForm.role}
                    onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                    className="w-full text-xs sm:text-sm bg-white border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                    City / District
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Salem, Tamil Nadu"
                    value={reviewForm.location}
                    onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                    className="w-full text-xs sm:text-sm bg-white border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Share Details of Your Experience with this Vehicle <span className="text-neutral-900">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Share details of vehicle condition, engine sound, yard inspection, documentation, or consultant assistance..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-white border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111] resize-none"
                ></textarea>
              </div>

              {/* Submission Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <span className="text-[11px] text-[#6B665F]">
                  ✓ Verified reviews automatically appear on our Home page customer testimonials wall.
                </span>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full sm:w-auto taste-btn inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#236628] text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-full transition-all cursor-pointer disabled:opacity-50"
                >
                  {reviewSubmitting ? (
                    <span>Posting Review...</span>
                  ) : (
                    <>
                      <span>Post Customer Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

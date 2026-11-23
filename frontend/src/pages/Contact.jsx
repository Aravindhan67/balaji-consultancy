import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    interest: 'general',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setErrorMsg('Please fill in your name, mobile number, and message');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await api.submitEnquiry(formData);
      if (res.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          city: '',
          interest: 'general',
          message: ''
        });
      } else {
        setErrorMsg(res.message || 'Error sending enquiry');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again or reach out on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How does Balaji Consultancy ensure the tractor engine and hydraulic pump are in good condition?',
      a: 'Every tractor entering our yard goes through a comprehensive 120-Point Mechanical Inspection conducted by our senior agricultural engineers. We test the engine compression ratio, injector flow rate, hydraulic lifting pressure under real weight loads, and verify that the hour meter has not been rolled back.'
    },
    {
      q: 'Can I buy a tractor or car from another state? How is RTO RC transfer handled?',
      a: 'Yes, absolutely! We handle complete RTO interstate paperwork including Form 28 (NOC), Form 29, and Form 30. Whether you are purchasing a vehicle registered in Punjab (PB), Maharashtra (MH), Gujarat (GJ), or Tamil Nadu (TN), we ensure 100% clean title and delivery to your district RTO.'
    },
    {
      q: 'How does payment and settlement work when buying or selling?',
      a: 'We operate with 100% transparent direct yard settlements. For buyers, we provide transparent fixed pricing with verified RTO transfer and genuine documentation. For sellers, once your tractor or car clears our 120-point mechanical check, you receive immediate spot cash bank transfer on the very same day with zero broker deductions.'
    },
    {
      q: 'Are the spare parts genuine and under warranty?',
      a: 'All our spare parts—including tractor dual clutch kits, Bosch CRDI fuel injectors, hydraulic lift valves, and ceramic brake pads—are sourced directly from authorized OEM manufacturers and come with standard 6 to 12 months warranty coverage.'
    },
    {
      q: 'Can I bring my own mechanic to inspect the vehicle before paying?',
      a: 'Yes, 100%! We welcome you and your personal trusted mechanic to visit our yard, perform a thorough inspection, and take a long test drive. Complete transparency is our promise.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 bg-[#F5F1EB] text-[#111111]">
      {/* Header Banner - Supro Minimalist Editorial Card */}
      <div className="bg-white text-[#111111] rounded-3xl p-8 sm:p-12 border border-[#E3DBD0]">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#1E6B37] uppercase tracking-wider bg-[#EAF3EB] px-3.5 py-1.5 rounded-full border border-[#C8E0CD]">
            <Sparkles className="w-3.5 h-3.5 text-[#1E6B37]" />
            Auto &amp; Agro Consultancy Yard Desk
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#111111] tracking-tight">
            Visit Our Yard or Enquire Online
          </h1>
          <p className="text-[#6B665F] text-xs sm:text-sm leading-relaxed font-normal">
            Have questions about a specific tractor, car, or spare part? Need assistance with RTO transfer or valuation? Our team is available 7 days a week.
          </p>
        </div>
      </div>

      {/* Main Grid: Form on Left, Contact Details & Map on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Enquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#E3DBD0]">
          <div className="mb-6">
            <h2 className="font-heading font-bold text-[#111111] text-xl">
              Send an Enquiry
            </h2>
            <p className="text-xs text-[#6B665F] mt-1">
              Submit your inquiry and our vehicle consultant will call you within 15 minutes.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-[#FAF8F5] rounded-2xl border border-[#E3DBD0] text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#111111] mx-auto" />
              <h3 className="font-heading font-bold text-[#111111] text-lg">Enquiry Sent Successfully!</h3>
              <p className="text-xs text-[#6B665F] max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to Balaji Auto &amp; Agro Consultancy. We have assigned a dedicated consultant to assist you.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-[#111111] underline pt-2 uppercase tracking-wider"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Anand Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. 8124336369"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. anand@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">City / District / State</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Salem, Tamil Nadu"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">What Are You Interested In?</label>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full text-xs font-semibold bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                >
                  <option value="buy_tractor">Buying a Second-Hand Tractor</option>
                  <option value="buy_car">Buying a Pre-Owned Car</option>
                  <option value="sell_vehicle">Selling My Tractor / Car</option>
                  <option value="spare_parts">Spare Parts Inquiry</option>
                  <option value="rto_consultancy">RTO RC Transfer / NOC</option>
                  <option value="general">General Consultancy Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">Your Message or Vehicle Requirement *</label>
                <textarea
                  rows="4"
                  name="message"
                  required
                  placeholder="Tell us what model you are looking for, your budget range, or specific tractor/car specifications..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full text-xs bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-3 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111] resize-none"
                ></textarea>
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
                className="w-full bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-none"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Yard Location on Right */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3DBD0] space-y-6">
            <h3 className="font-heading font-bold text-[#111111] text-base uppercase tracking-wider pb-3 border-b border-[#E3DBD0]">
              Balaji Consultation Yard
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-full bg-[#FAF8F5] text-[#111111] border border-[#E3DBD0] flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111111]">Physical Yard &amp; Office Address</div>
                  <p className="text-xs text-[#6B665F] leading-relaxed mt-1">
                    Balaji Auto &amp; Agro Consultancy Complex,<br />
                    National Highway Bypass (Opp. Agricultural Mandi),<br />
                    Salem - 636005, Tamil Nadu, India.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-full bg-[#FAF8F5] text-[#111111] border border-[#E3DBD0] flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111111]">Direct Consultant Desk</div>
                  <p className="text-xs text-[#6B665F] mt-1">
                    <a href="tel:+918124336369" className="hover:text-[#111111] font-semibold">
                      +91 81243 36369
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-full bg-[#FAF8F5] text-[#111111] border border-[#E3DBD0] flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111111]">Inspection Yard Timings</div>
                  <p className="text-xs text-[#6B665F] mt-1">
                    Monday to Sunday (All 7 Days Open)<br />
                    9:00 AM to 8:00 PM IST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-full bg-[#FAF8F5] text-[#111111] border border-[#E3DBD0] flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111111]">Email Desk</div>
                  <p className="text-xs text-[#6B665F] mt-1">
                    enquiry@balajiconsultancy.com
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E3DBD0] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#111111]">Instant WhatsApp Support</div>
                <div className="text-[11px] text-[#6B665F]">Chat directly with senior vehicle evaluator</div>
              </div>
              <a
                href="https://wa.me/918124336369?text=Hello%20Balaji%20Consultancy!%20I%20would%20like%20to%20enquire%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#111111] hover:bg-neutral-800 text-white p-2.5 rounded-full transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E3DBD0] space-y-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] font-bold text-[#111111] bg-[#EAE3D7] px-3.5 py-1 rounded-full uppercase tracking-wider border border-[#DCD4C7]">
            Clarifications
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#111111] mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#6B665F] mt-1">Everything you need to know about purchasing or selling through Balaji</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[#E3DBD0] rounded-2xl overflow-hidden transition-all bg-[#FAF8F5]"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#111111] flex items-center justify-between gap-4 hover:bg-[#EAE3D7] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#111111] transition-transform duration-200 flex-shrink-0 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="p-4 pt-1 text-xs text-[#6B665F] leading-relaxed border-t border-[#E3DBD0] bg-white">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;

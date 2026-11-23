import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  QrCode, 
  FileCheck, 
  Calendar, 
  MapPin, 
  Printer, 
  PhoneCall,
  Check
} from 'lucide-react';

export function InspectionCertificateModal({ isOpen, onClose, vehicle = null }) {
  if (!isOpen) return null;

  const title = vehicle?.title || 'Mahindra 575 DI Sarpanch (45 HP)';
  const brand = vehicle?.brand || 'Mahindra';
  const year = vehicle?.modelYear || '2021';
  const rto = vehicle?.rtoPassing || 'TN-34 Tiruchengode (All-India NOC Ready)';
  const certId = vehicle?._id ? `BAC-${vehicle._id.slice(-6).toUpperCase()}` : 'BAC-2026-CERT-9842';

  const checkSections = [
    {
      title: '1. Engine & Powertrain (35 Points)',
      items: [
        { name: 'Cylinder Compression Pressure (380-420 PSI)', result: 'Optimal (410 PSI)' },
        { name: 'Cold-Start Idle Stability (750 RPM)', result: 'Pass (No Vibration)' },
        { name: 'Crankcase Blow-by & Tappet Sound', result: 'Zero Blow-by Verified' },
        { name: 'Radiator Pressure & Coolant Clarity', result: 'Pass (Zero Contamination)' }
      ]
    },
    {
      title: '2. Hydraulic Lift & PTO Assembly (25 Points)',
      items: [
        { name: 'Hydraulic Lift Capacity (1,600 kg rated)', result: 'Tested at 1,650 kg' },
        { name: 'Spool Valve Hold Test (15 min load test)', result: '0.0 mm Height Drop' },
        { name: '540 RPM Dual-Clutch PTO Engagement', result: 'Instant Smooth Lock' },
        { name: 'Lower 3-Point Link Arms & Pins', result: 'Factory OEM Spec' }
      ]
    },
    {
      title: '3. Transmission, Brakes & Electricals (30 Points)',
      items: [
        { name: 'Constant-Mesh 8F + 2R Gearbox Sync', result: 'Zero Grinding / Slip' },
        { name: 'Oil-Immersed Multi-Disc Brakes (OIB)', result: 'Equal Dual-Pedal Lock' },
        { name: 'Battery Health & Alternator Voltage', result: '14.2V Charging Ready' },
        { name: 'Tyre Tread Lug Depth', result: 'Front 80%, Rear 85%' }
      ]
    },
    {
      title: '4. Legal RTO & Registry Clearance (30 Points)',
      items: [
        { name: 'Physical Chassis Punch vs RC Match', result: '100% Exact Match' },
        { name: 'Bank Hypothecation & Form 35 NOC', result: 'Fully Cleared & Free' },
        { name: 'Vahan Portal Encumbrance Search', result: 'Zero Blacklist / Zero Challan' },
        { name: 'Interstate NOC Guarantee', result: 'Issued Within 14 Days' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Decorative Header Band */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-8 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Close Certificate"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Balaji Certified Technical Report</span>
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                120-Point Yard Inspection Certificate
              </h2>
              <p className="text-orange-100 text-xs font-medium">
                Issued by Balaji Automotive &amp; Agro Consultancy Inspection Yard
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex sm:flex-col items-center justify-center bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/25 shrink-0 text-center">
              <span className="text-[10px] uppercase font-bold text-orange-200">Yard Score</span>
              <span className="font-heading font-black text-2xl sm:text-3xl text-amber-300">98.4<span className="text-xs font-bold text-white">/100</span></span>
              <span className="text-[10px] font-bold text-emerald-300">Grade: Tier-A Premium</span>
            </div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata Card */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Vehicle Inspected</div>
              <div className="font-extrabold text-slate-900 mt-0.5 truncate">{title}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Certificate No.</div>
              <div className="font-mono font-bold text-orange-600 mt-0.5">{certId}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">RTO / Registration</div>
              <div className="font-bold text-slate-800 mt-0.5 truncate">{rto}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Passing Status</div>
              <div className="inline-flex items-center gap-1 font-bold text-emerald-700 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Guaranteed</span>
              </div>
            </div>
          </div>

          {/* 4 Inspection Domains */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checkSections.map((sec, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
                <div className="font-heading font-bold text-slate-900 text-xs flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span>{sec.title}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Passed</span>
                </div>
                <div className="space-y-1.5">
                  {sec.items.map((item, i) => (
                    <div key={i} className="flex items-start justify-between text-[11px] gap-2">
                      <span className="text-slate-600 font-medium flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{item.name}</span>
                      </span>
                      <span className="text-slate-900 font-bold shrink-0">{item.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mechanic Stamp & Guarantee Seal */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/80 -mx-6 -mb-6 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-dashed border-[#1E6B37]/50 flex flex-col items-center justify-center p-2 text-center shadow-sm">
                <Award className="w-6 h-6 text-[#1E6B37]" />
                <span className="text-[8px] font-black uppercase text-[#1E6B37]">SEAL</span>
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-heading font-extrabold text-slate-900">
                  Er. K. Balaji, Chief Inspection Engineer
                </div>
                <div className="text-slate-500 text-[11px]">
                  B.E. Automobile • National Vehicle Inspection Registry #BAC-TN-98
                </div>
                <div className="text-[#1E6B37] font-bold text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E6B37]" />
                  <span>Backed by Balaji 6-Month Yard Mechanical Warranty</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => window.print()}
                className="taste-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-[#1E6B37] hover:text-white text-slate-700 text-xs font-bold transition-all shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="taste-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-5 py-2.5 rounded-full bg-[#1E6B37] hover:bg-[#155A2D] text-white text-xs font-bold transition-all"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

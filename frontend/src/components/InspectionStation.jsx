import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wrench, 
  FileCheck, 
  Gauge, 
  CheckCircle2, 
  Activity, 
  Check, 
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function InspectionStation() {
  const [activeTab, setActiveTab] = useState('engine');

  const categories = [
    {
      id: 'engine',
      label: '1. Engine & Compression',
      icon: Activity,
      headline: 'Compression, Cold-Start & Oil Pressure Rigor',
      badge: 'Zero Blow-by Guarantee',
      tests: [
        { name: 'Cylinder Compression PSI', benchmark: '380 - 420 PSI', status: 'Passed', score: '100%' },
        { name: 'Cold-Start RPM & Tappet Sound', benchmark: '750 ± 25 RPM idle', status: 'Passed', score: 'Nominal' },
        { name: 'Oil Sump & Coolant Cross-Check', benchmark: 'No milky emulsion', status: 'Verified', score: 'Clean' },
        { name: 'Radiator Heat Dissipation Under Load', benchmark: '82°C - 88°C operating', status: 'Passed', score: 'Optimal' },
        { name: 'CRDI / Bosch Injector Delivery Rate', benchmark: 'Equal calibration', status: 'Tested', score: 'Calibrated' }
      ],
      description: 'Our senior mechanics run every engine cold and at peak load. We verify that there is zero crankcase blow-by, zero oil leakage from front or rear seals, and consistent fuel injection.'
    },
    {
      id: 'hydraulic',
      label: '2. Hydraulic & PTO Lift',
      icon: Gauge,
      headline: 'Heavy Agricultural Draft & 540 PTO Testing',
      badge: '1,500 - 2,000 KG Rated',
      tests: [
        { name: 'Hydraulic Lift Draft Control Response', benchmark: 'Zero hunting under load', status: 'Passed', score: 'Stable' },
        { name: 'Spool Valve Leakage Test', benchmark: 'Hold 1.5T load for 15 min', status: 'Passed', score: '0.0 mm drop' },
        { name: 'Dual Clutch & PTO Engagement (540 RPM)', benchmark: 'Immediate spline lock', status: 'Verified', score: 'Smooth' },
        { name: 'Lower Link Arm & Check Chain Integrity', benchmark: 'No crack or weld bend', status: 'Passed', score: 'Original OEM' },
        { name: 'Pump Flow Rate & Strainer Cleanliness', benchmark: '32 L/min pressure', status: 'Tested', score: 'Certified' }
      ],
      description: 'A second-hand tractor is only as good as its hydraulic system. We hook each tractor to full agricultural implement weights to ensure hydraulic pump pressure and draft control never leak or fail.'
    },
    {
      id: 'rto',
      label: '3. Legal RTO & RC NOC',
      icon: FileCheck,
      headline: '100% Guaranteed Ownership & Hypothecation Clearance',
      badge: 'Zero Legal Encumbrance',
      tests: [
        { name: 'Chassis Punch & Engine Number Physical Match', benchmark: 'Exact Vahan portal match', status: 'Verified', score: 'Matched' },
        { name: 'Bank Hypothecation & Loan NOC Clearance', benchmark: 'Official Form 35 released', status: 'Clear', score: '100% Free' },
        { name: 'State RTO Tax Validity & Road Worthiness', benchmark: 'Up-to-date road tax', status: 'Active', score: 'Current' },
        { name: 'Pollution Certificate & Active Insurance', benchmark: 'Certified validity', status: 'Passed', score: 'Valid' },
        { name: 'Seamless Interstate Transfer Support', benchmark: 'NOC issued from origin state', status: 'Ready', score: 'Guaranteed' }
      ],
      description: 'Never worry about police issues, bank seizure, or duplicate registration. We check the official national Vahan registry and physically match the stamped chassis number on the frame before listing.'
    },
    {
      id: 'transmission',
      label: '4. Gearbox, Brakes & Spares',
      icon: Wrench,
      headline: 'Constant-Mesh Gearbox, Wet Brakes & OEM Spares',
      badge: 'Genuine Parts Guarantee',
      tests: [
        { name: 'Forward / Reverse Synchronizer Shift', benchmark: 'Zero grinding or slippage', status: 'Passed', score: 'Crisp' },
        { name: 'Oil Immersed Multi-Disc Brakes (OIB)', benchmark: 'Equal dual-pedal lock', status: 'Tested', score: 'Tested' },
        { name: 'Differential Lock & Axle Seal Check', benchmark: 'Zero side-play or hum', status: 'Verified', score: 'Factory Spec' },
        { name: 'Tyre Tread Depth & Radial Casing', benchmark: 'Min 75% agricultural lug depth', status: 'Inspected', score: '85% Avg' },
        { name: 'Genuine OEM Replacement Parts Used', benchmark: 'Exide/Bosch/TVS Girling only', status: 'Certified', score: 'OEM Grade' }
      ],
      description: 'Every gear ratio is stress-tested uphill and reverse under trailer conditions. Any worn brake disc, clutch bearing, or battery is replaced with brand-new genuine OEM spares from our yard inventory.'
    }
  ];

  const current = categories.find(c => c.id === activeTab) || categories[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Top Banner with Trust Badges */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Balaji Certified Mechanical Station</span>
          </div>
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            The 120-Point Physical Verification Standard
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            See how our mechanics inspect every cylinder, hydraulic pump, and RTO document before approving a vehicle for sale.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
          <Award className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">Yard Guarantee</div>
            <div className="text-sm font-extrabold text-white">100% Certified Passing</div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-2 sm:p-3 overflow-x-auto scrollbar-none">
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-orange-600 shadow-sm border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Inspection Chamber Content */}
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details: Headline, Description & Real Test List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
                {current.headline}
              </h4>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {current.badge}
              </span>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {current.description}
            </p>

            {/* Test Checklist Table */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Verified Mechanical Checkpoints:
              </div>
              {current.tests.map((test, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/70 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{test.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">Spec: {test.benchmark}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {test.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Chamber: Verification Seal Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-orange-50/40 p-6 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
              <div>
                <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Quality Seal</div>
                <div className="font-heading font-extrabold text-base text-slate-900">Certificate of Field Readiness</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-orange-600 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Inspection Standard</span>
                <span className="font-bold text-slate-800">120 Mechanical Points</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Engine Oil Pressure</span>
                <span className="font-bold text-emerald-600">3.8 kg/cm² (Factory High)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">RTO Police Record</span>
                <span className="font-bold text-emerald-600">Zero Pending Challans</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Original Owner Paperwork</span>
                <span className="font-bold text-slate-800">Form 29 &amp; 30 Ready</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Consultancy Warranty</span>
                <span className="font-bold text-orange-600">Full Buyback Protection</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm text-center">
              <div className="text-[11px] text-slate-500">
                Want to test-drive or inspect any tractor or car at our yard?
              </div>
              <a
                href="tel:+918124336369"
                className="mt-2.5 inline-flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs py-2.5 rounded-lg transition-colors"
              >
                Schedule Free Yard Inspection
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

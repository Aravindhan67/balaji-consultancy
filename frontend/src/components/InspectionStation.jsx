import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Volume2,
  VolumeX,
  FileText
} from 'lucide-react';
import { engineSound } from '../utils/engineSound';
import { InspectionCertificateModal } from './InspectionCertificateModal';

export function InspectionStation() {
  const [activeTab, setActiveTab] = useState('engine');
  const [isEngineSoundPlaying, setIsEngineSoundPlaying] = useState(false);
  const [currentRPM, setCurrentRPM] = useState(750);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  useEffect(() => {
    return () => {
      try {
        if (engineSound && engineSound.isPlaying) {
          engineSound.stop();
        }
      } catch (e) {
        // Safe cleanup
      }
    };
  }, []);

  const handleToggleEngineSound = () => {
    if (isEngineSoundPlaying) {
      engineSound.stop();
      setIsEngineSoundPlaying(false);
    } else {
      engineSound.start((rpm) => {
        setCurrentRPM(rpm);
      });
      setIsEngineSoundPlaying(true);
    }
  };

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
    <>
      <div className="bg-white rounded-3xl border border-[#E3DBD0] overflow-hidden">
        {/* Top Banner with Trust Badges & Certificate Trigger - Supro Minimalist Editorial Banner */}
        <div className="bg-[#FAF8F5] border-b border-[#E3DBD0] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE3D7] text-[#111111] text-[10px] font-bold uppercase tracking-wider border border-[#DCD4C7] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
              <span>Balaji Certified Mechanical Station</span>
            </div>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111111] tracking-tight">
              The 120-Point Physical Verification Standard
            </h3>
            <p className="text-[#6B665F] text-xs sm:text-sm mt-1 max-w-xl">
              See how our mechanics inspect every cylinder, hydraulic pump, and RTO document before approving a vehicle for sale.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsCertModalOpen(true)}
              className="taste-btn inline-flex items-center gap-2 bg-[#1E6B37] hover:bg-[#155A2D] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full border border-[#166534] transition-all shadow-none"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>View Sample Certificate</span>
            </button>

            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-[#E3DBD0]">
              <Award className="w-6 h-6 text-[#111111] shrink-0" />
              <div>
                <div className="text-[9px] text-[#8C857B] font-bold uppercase tracking-widest">Yard Guarantee</div>
                <div className="text-xs font-bold text-[#111111]">100% Certified Passing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tabs Header */}
        <div className="border-b border-[#E3DBD0] bg-[#FAF8F5] p-2 sm:p-3 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#1E6B37] text-white shadow-none'
                      : 'text-[#6B665F] hover:text-[#1E6B37] hover:bg-[#EAF3EB]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#8C857B]'}`} />
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
                <h4 className="font-heading font-black text-xl sm:text-2xl text-[#111111]">
                  {current.headline}
                </h4>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAE3D7] text-[#111111] border border-[#DCD4C7]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#111111]" />
                  {current.badge}
                </span>
              </div>

              <p className="text-[#6B665F] text-xs sm:text-sm leading-relaxed">
                {current.description}
              </p>

              {/* Special Interactive Cold-Start Engine Sound Bar under Engine Tab */}
              {activeTab === 'engine' && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E3DBD0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0">
                      {isEngineSoundPlaying ? (
                        <Volume2 className="w-5 h-5 animate-pulse" />
                      ) : (
                        <VolumeX className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#111111] flex items-center gap-2">
                        <span>4-Cylinder Diesel Cold-Start Synthesizer</span>
                        {isEngineSoundPlaying && (
                          <span className="text-[10px] font-bold bg-[#EAE3D7] text-[#111111] px-2 py-0.5 rounded-full">
                            Active: {currentRPM} RPM
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#6B665F]">
                        Synthesizes realistic 750 RPM idle tappet compression and exhaust thrum.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleEngineSound}
                    className={`taste-btn shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${
                      isEngineSoundPlaying
                        ? 'bg-[#1E6B37] text-white hover:bg-[#155A2D]'
                        : 'bg-[#1E6B37] text-white hover:bg-[#155A2D]'
                    }`}
                  >
                    {isEngineSoundPlaying ? (
                      <>
                        <VolumeX className="w-4 h-4 text-white" />
                        <span>Stop Engine</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Listen to Engine Sound 🔊</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Test Checklist Table */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#8C857B] mb-1">
                  Verified Mechanical Checkpoints:
                </div>
                {current.tests.map((test, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E3DBD0] text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white text-[#111111] border border-[#E3DBD0] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <div className="font-bold text-[#111111]">{test.name}</div>
                        <div className="text-[11px] text-[#6B665F] font-normal">Spec: {test.benchmark}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block px-3 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider bg-white text-[#111111] border border-[#E3DBD0]">
                        {test.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Chamber: Verification Seal Card */}
            <div className="lg:col-span-5 bg-[#FAF8F5] p-6 rounded-2xl border border-[#E3DBD0] space-y-6">
              <div className="flex items-center justify-between border-b border-[#E3DBD0] pb-4">
                <div>
                  <div className="text-[10px] font-bold text-[#8C857B] uppercase tracking-wider">Quality Seal</div>
                  <div className="font-heading font-black text-base text-[#111111]">Certificate of Field Readiness</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-white border border-[#E3DBD0] flex items-center justify-center text-[#111111]">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#E3DBD0]/60">
                  <span className="text-[#6B665F]">Inspection Standard</span>
                  <span className="font-bold text-[#111111]">120 Mechanical Points</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E3DBD0]/60">
                  <span className="text-[#6B665F]">Engine Oil Pressure</span>
                  <span className="font-bold text-[#111111]">3.8 kg/cm² (Factory High)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E3DBD0]/60">
                  <span className="text-[#6B665F]">RTO Police Record</span>
                  <span className="font-bold text-[#111111]">Zero Pending Challans</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E3DBD0]/60">
                  <span className="text-[#6B665F]">Original Owner Paperwork</span>
                  <span className="font-bold text-[#111111]">Form 29 &amp; 30 Ready</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#6B665F]">Consultancy Warranty</span>
                  <span className="font-bold text-[#111111]">Full Buyback Protection</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#E3DBD0] text-center space-y-2.5">
                <div className="text-[11px] text-[#6B665F]">
                  Want to inspect or test-drive any tractor or car at our yard?
                </div>
                <a
                  href="tel:+918124336369"
                  className="inline-flex items-center justify-center gap-2 w-full bg-[#1E6B37] hover:bg-[#155A2D] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-full transition-colors"
                >
                  Schedule Free Yard Inspection
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(true)}
                  className="w-full text-[11px] font-bold text-[#111111] hover:underline pt-1 uppercase tracking-wider"
                >
                  📄 View Sample Certified Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 120-Point Certificate Modal */}
      <InspectionCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export function ValuationEstimator() {
  const [vehicleType, setVehicleType] = useState('tractor');
  const [brand, setBrand] = useState('Mahindra');
  const [year, setYear] = useState('2021');
  const [condition, setCondition] = useState('good');
  const [hoursOrKm, setHoursOrKm] = useState('1800');

  // Base values for estimation formula
  const baseRates = {
    tractor: {
      Mahindra: 480000,
      Swaraj: 510000,
      'John Deere': 590000,
      Sonalika: 440000,
      'Massey Ferguson': 460000
    },
    car: {
      'Maruti Suzuki': 420000,
      Hyundai: 460000,
      Tata: 550000,
      Mahindra: 680000,
      Toyota: 850000
    }
  };

  const calculateEstimate = () => {
    const typeRates = baseRates[vehicleType] || baseRates.tractor;
    const base = typeRates[brand] || 450000;
    
    // Year factor: 2024 (1.05), 2023 (0.95), 2022 (0.86), 2021 (0.78), 2020 (0.70), 2019 (0.62)
    const currentYear = 2024;
    const selectedYear = parseInt(year, 10);
    const age = Math.max(0, currentYear - selectedYear);
    const ageFactor = Math.max(0.5, 1 - (age * 0.08));

    // Condition factor
    const conditionMultipliers = {
      excellent: 1.12,
      good: 1.0,
      fair: 0.88
    };
    const condFactor = conditionMultipliers[condition] || 1.0;

    const estimated = Math.round((base * ageFactor * condFactor) / 5000) * 5000;
    const low = Math.round(estimated * 0.94 / 5000) * 5000;
    const high = Math.round(estimated * 1.06 / 5000) * 5000;

    return { estimated, low, high };
  };

  const { estimated, low, high } = calculateEstimate();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200 mb-3">
          <Calculator className="w-4 h-4 text-orange-600" />
          <span>Transparent Pricing Algorithm</span>
        </div>
        <h3 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
          Instant Fair Market Valuation Calculator
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Calculate the authentic resale value of your tractor or car based on real market demand and yard transaction records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Input Parameters Form */}
        <div className="lg:col-span-7 space-y-4">
          {/* Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select Vehicle Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setVehicleType('tractor');
                  setBrand('Mahindra');
                }}
                className={`py-3 px-4 rounded-xl text-xs font-extrabold border transition-all ${
                  vehicleType === 'tractor'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🚜 Agricultural Tractor
              </button>
              <button
                type="button"
                onClick={() => {
                  setVehicleType('car');
                  setBrand('Maruti Suzuki');
                }}
                className={`py-3 px-4 rounded-xl text-xs font-extrabold border transition-all ${
                  vehicleType === 'car'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🚗 Car / Bolero Utility
              </button>
            </div>
          </div>

          {/* Brand & Model Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Manufacturer Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {vehicleType === 'tractor' ? (
                  <>
                    <option value="Mahindra">Mahindra (575 DI, 475, Arjun)</option>
                    <option value="Swaraj">Swaraj (855 FE, 744 FE)</option>
                    <option value="John Deere">John Deere (5310, 5050D)</option>
                    <option value="Sonalika">Sonalika Sikander</option>
                    <option value="Massey Ferguson">Massey Ferguson (241, 1035)</option>
                  </>
                ) : (
                  <>
                    <option value="Mahindra">Mahindra (Bolero, Scorpio)</option>
                    <option value="Maruti Suzuki">Maruti Suzuki (Swift, Dzire, Ertiga)</option>
                    <option value="Hyundai">Hyundai (Creta, i20)</option>
                    <option value="Tata">Tata Motors (Nexon, Tiago)</option>
                    <option value="Toyota">Toyota (Innova Crysta)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Registration Model Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="2024">2024 (Almost New)</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018 (Older Model)</option>
              </select>
            </div>
          </div>

          {/* Condition Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mechanical Condition</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'excellent', label: 'Mint / Single Owner' },
                { id: 'good', label: 'Good Running / Working' },
                { id: 'fair', label: 'Needs Minor Work' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id)}
                  className={`py-2 px-2.5 text-[11px] font-bold rounded-xl border text-center transition-all ${
                    condition === c.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Calculation Display Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-white rounded-2xl p-6 sm:p-7 border border-orange-200/90 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-orange-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-900">
              Estimated Yard Resale Range
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Live Market Rate
            </span>
          </div>

          <div className="my-5 text-center">
            <div className="text-[11px] text-slate-500 font-medium">Average Expected Valuation</div>
            <div className="font-heading font-black text-3xl sm:text-4xl text-slate-950 mt-1 tracking-tight">
              {formatINR(estimated)}
            </div>
            <div className="text-xs text-slate-600 mt-2 font-semibold">
              Fair Band: <span className="text-orange-700">{formatINR(low, false)}</span> - <span className="text-emerald-700">{formatINR(high, false)}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 border-t border-orange-200/70 pt-4 mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Includes Free RTO Ownership Transfer</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Immediate Spot Cash Payment on Agreement</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <Link
              to={`/quotation?type=${vehicleType}&brand=${brand}&year=${year}`}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-orange-600/25 flex items-center justify-center gap-1.5"
            >
              Lock in Official Free Valuation
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="https://wa.me/918124336369?text=Hello%20Balaji%20Consultancy!%20I%20checked%20the%20online%20valuation%20for%20my%20vehicle%20and%20want%20to%20sell%20or%20get%20inspected."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs py-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              Discuss Directly on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

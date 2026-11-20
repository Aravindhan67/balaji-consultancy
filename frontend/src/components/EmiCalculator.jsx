import React, { useState } from 'react';
import { 
  Calculator, 
  IndianRupee, 
  Calendar, 
  Percent, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

export function EmiCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState(550000); // Default ₹5.5 Lakh
  const [downPaymentPercent, setDownPaymentPercent] = useState(25); // 25%
  const [interestRate, setInterestRate] = useState(9.5); // 9.5% p.a.
  const [tenureYears, setTenureYears] = useState(3); // 3 Years (36 Months)

  // Calculations
  const downPayment = Math.round((vehiclePrice * downPaymentPercent) / 100);
  const loanAmount = vehiclePrice - downPayment;
  const tenureMonths = tenureYears * 12;
  const monthlyRate = interestRate / 12 / 100;

  // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - loanAmount;

  const waMessage = encodeURIComponent(
    `Hello Balaji Consultancy! I used your EMI Calculator for a vehicle of ${formatINR(vehiclePrice, false)}. With down payment of ${formatINR(downPayment, false)} and ${tenureYears}-year tenure, my estimated EMI is ${formatINR(emi, false)}/month. Please assist me with agricultural loan options.`
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-10">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-3">
          <Calculator className="w-4 h-4 text-emerald-600" />
          <span>Kisan Credit &amp; Commercial Vehicle Finance</span>
        </div>
        <h3 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
          Tractor &amp; Vehicle Loan EMI Calculator
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
          Calculate your monthly installment with low interest rates from leading agricultural banks (SBI, HDFC, Kotak &amp; Gramin Banks).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Input Area */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Vehicle Price Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700">Vehicle Total Price</label>
              <span className="font-heading font-black text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-xl border border-orange-200">
                {formatINR(vehiclePrice)}
              </span>
            </div>
            <input
              type="range"
              min="200000"
              max="1500000"
              step="25000"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>₹2.0 Lakh</span>
              <span>₹7.5 Lakh</span>
              <span>₹15.0 Lakh</span>
            </div>
          </div>

          {/* 2. Down Payment Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700">
                Down Payment ({downPaymentPercent}%)
              </label>
              <span className="font-heading font-black text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                {formatINR(downPayment)}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>10% (Min)</span>
              <span>25% (Standard)</span>
              <span>60% (Max)</span>
            </div>
          </div>

          {/* 3. Interest Rate & Loan Tenure Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700">Annual Interest Rate</label>
                <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                  {interestRate}% p.a.
                </span>
              </div>
              <input
                type="range"
                min="8.0"
                max="14.0"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>8.0% (Kisan)</span>
                <span>14.0%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700">Tenure (Duration)</label>
                <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                  {tenureYears} Years ({tenureMonths} Mo)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 Year</span>
                <span>3 Years</span>
                <span>5 Years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/40 rounded-2xl p-6 sm:p-8 border border-emerald-200/90 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200/70">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900">
                Monthly Repayment Estimate
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Bank Pre-Approved
              </span>
            </div>

            {/* Big EMI Highlight */}
            <div className="my-5 text-center">
              <div className="text-[11px] text-slate-500 font-semibold">Monthly EMI Amount</div>
              <div className="font-heading font-black text-3xl sm:text-4xl text-slate-950 mt-1 tracking-tight">
                {formatINR(emi)}
                <span className="text-xs font-semibold text-slate-500 ml-1">/ month</span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2 text-xs text-slate-600 border-t border-emerald-200/70 pt-4 mb-6">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Loan Amount Funded:</span>
                <span className="font-bold text-slate-800">{formatINR(loanAmount)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Total Interest Payable:</span>
                <span className="font-bold text-slate-800">{formatINR(totalInterest)}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-100 font-bold">
                <span className="text-slate-700">Total Amount Payable:</span>
                <span className="text-emerald-700">{formatINR(totalPayment)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <a
              href={`https://wa.me/918124336369?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="taste-btn w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Apply for Loan on WhatsApp
            </a>
            <div className="text-[10px] text-center text-slate-400">
              *Approximate calculation. Final sanction based on bank eligibility &amp; RC hypothecation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

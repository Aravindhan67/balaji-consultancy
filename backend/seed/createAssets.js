import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Generate an attractive SVG vehicle/part banner and save to uploads folder
function generateSvgAsset(filename, title, subtitle, category, primaryColor, accentColor, iconType) {
  const filePath = path.join(uploadsDir, filename);

  let iconGraphic = '';
  if (iconType === 'tractor') {
    iconGraphic = `
      <!-- Tractor Silhouette -->
      <g transform="translate(250, 100) scale(1.1)">
        <!-- Rear Large Wheel -->
        <circle cx="80" cy="170" r="55" fill="#1f2937" stroke="${accentColor}" stroke-width="8"/>
        <circle cx="80" cy="170" r="28" fill="#374151" stroke="#fff" stroke-width="4"/>
        <line x1="80" y1="115" x2="80" y2="225" stroke="#fff" stroke-width="3"/>
        <line x1="25" y1="170" x2="135" y2="170" stroke="#fff" stroke-width="3"/>
        
        <!-- Front Small Wheel -->
        <circle cx="230" cy="190" r="35" fill="#1f2937" stroke="${accentColor}" stroke-width="6"/>
        <circle cx="230" cy="190" r="16" fill="#374151" stroke="#fff" stroke-width="3"/>
        
        <!-- Tractor Body / Hood -->
        <path d="M 70 140 L 70 70 L 120 70 L 140 110 L 240 110 L 245 150 L 210 160 L 130 160 Z" fill="${primaryColor}" rx="8"/>
        <!-- Engine grill -->
        <rect x="235" y="115" width="10" height="30" fill="#111827" rx="2"/>
        <line x1="225" y1="120" x2="240" y2="120" stroke="#fbbf24" stroke-width="2"/>
        <!-- Silencer / Exhaust pipe -->
        <rect x="180" y="30" width="8" height="80" fill="#4b5563" rx="2"/>
        <path d="M 180 30 C 180 20, 200 20, 200 30" stroke="#4b5563" stroke-width="6" fill="none"/>
        <!-- Driver Seat & Roll Bar / Canopy -->
        <path d="M 50 135 L 75 135 L 70 110" stroke="#1f2937" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M 40 165 L 40 40 L 130 40 L 130 70" stroke="#374151" stroke-width="5" fill="none" stroke-linejoin="round"/>
        <!-- Canopy top -->
        <rect x="30" y="32" width="110" height="12" fill="${accentColor}" rx="3"/>
        <!-- Steering -->
        <line x1="110" y1="105" x2="125" y2="125" stroke="#111827" stroke-width="4"/>
        <circle cx="107" cy="102" r="8" fill="none" stroke="#111827" stroke-width="3"/>
        <!-- Headlight beam -->
        <polygon points="248,125 310,105 310,165 248,140" fill="url(#headlightGrad)" opacity="0.45"/>
      </g>
    `;
  } else if (iconType === 'car') {
    iconGraphic = `
      <!-- Modern Car Silhouette -->
      <g transform="translate(240, 110) scale(1.05)">
        <!-- Car Body -->
        <path d="M 40 160 C 50 140, 70 110, 110 95 C 150 80, 200 80, 240 95 C 280 110, 300 130, 320 145 L 340 155 C 345 160, 345 175, 335 180 L 30 180 C 25 175, 25 165, 40 160 Z" fill="${primaryColor}"/>
        <!-- Cabin / Windows -->
        <path d="M 115 102 L 155 88 L 225 88 L 245 102 C 240 125, 220 135, 120 135 Z" fill="#93c5fd" opacity="0.85"/>
        <line x1="175" y1="88" x2="175" y2="135" stroke="${primaryColor}" stroke-width="4"/>
        <!-- Headlights & Taillights -->
        <polygon points="328,155 338,158 335,168 322,165" fill="#fef08a"/>
        <polygon points="35,160 28,162 30,172 38,170" fill="#ef4444"/>
        <!-- Wheels -->
        <circle cx="95" cy="180" r="32" fill="#1f2937" stroke="#e5e7eb" stroke-width="6"/>
        <circle cx="95" cy="180" r="14" fill="#6b7280"/>
        <circle cx="275" cy="180" r="32" fill="#1f2937" stroke="#e5e7eb" stroke-width="6"/>
        <circle cx="275" cy="180" r="14" fill="#6b7280"/>
        <!-- Ground Shadow -->
        <ellipse cx="185" cy="214" rx="150" ry="8" fill="#000" opacity="0.18"/>
        <!-- Light beam -->
        <polygon points="338,158 400,140 400,195 338,172" fill="url(#headlightGrad)" opacity="0.4"/>
      </g>
    `;
  } else {
    // Spare part / mechanical gear & assembly
    iconGraphic = `
      <!-- Spare Parts Cog & Tool Graphic -->
      <g transform="translate(300, 100) scale(1.1)">
        <!-- Mechanical Gear -->
        <g stroke="${primaryColor}" stroke-width="12" fill="none">
          <circle cx="100" cy="110" r="60" stroke="${accentColor}" stroke-width="18" stroke-dasharray="18 10"/>
        </g>
        <circle cx="100" cy="110" r="42" fill="${primaryColor}"/>
        <circle cx="100" cy="110" r="18" fill="#f8fafc" stroke="#334155" stroke-width="4"/>
        <!-- Wrench tool crossed -->
        <path d="M 50 160 L 150 60" stroke="#475569" stroke-width="14" stroke-linecap="round"/>
        <path d="M 140 50 C 150 40, 165 45, 165 60 C 165 75, 150 80, 140 70 Z" fill="#64748b"/>
        <!-- Sparkle / Certified Star -->
        <polygon points="160,140 165,152 178,152 168,160 172,172 160,165 148,172 152,160 142,152 155,152" fill="#eab308"/>
      </g>
    `;
  }

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="headlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="${accentColor}"/>
    </linearGradient>
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="1" opacity="0.6"/>
    </pattern>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="500" fill="url(#bgGrad)"/>
  <rect width="800" height="500" fill="url(#gridPattern)"/>

  <!-- Decorative Accent Glows -->
  <circle cx="100" cy="80" r="140" fill="${primaryColor}" opacity="0.08"/>
  <circle cx="700" cy="400" r="160" fill="${accentColor}" opacity="0.08"/>

  <!-- Top Category Tag -->
  <rect x="50" y="45" width="150" height="34" rx="17" fill="url(#badgeGrad)"/>
  <text x="125" y="67" font-family="sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">
    ${category.toUpperCase()}
  </text>

  <!-- Verified Indian Quality Seal -->
  <g transform="translate(640, 40)">
    <circle cx="45" cy="45" r="42" fill="#15803d" opacity="0.12"/>
    <circle cx="45" cy="45" r="36" fill="#15803d"/>
    <text x="45" y="38" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">BALAJI</text>
    <text x="45" y="52" font-family="sans-serif" font-size="11" font-weight="900" fill="#fef08a" text-anchor="middle">VERIFIED</text>
    <text x="45" y="64" font-family="sans-serif" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">100% INSPECTED</text>
  </g>

  <!-- Graphic illustration -->
  ${iconGraphic}

  <!-- Lower Details Container -->
  <rect x="40" y="360" width="720" height="105" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.04))"/>
  
  <text x="65" y="405" font-family="sans-serif" font-size="24" font-weight="800" fill="#0f172a">
    ${title}
  </text>
  
  <text x="65" y="438" font-family="sans-serif" font-size="14" font-weight="500" fill="#64748b">
    ${subtitle}
  </text>

  <!-- Guarantee stamp -->
  <g transform="translate(610, 385)">
    <rect width="130" height="42" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
    <text x="65" y="22" font-family="sans-serif" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">RTO &amp; RC OK</text>
    <text x="65" y="35" font-family="sans-serif" font-size="10" font-weight="600" fill="#16a34a" text-anchor="middle">Ready for Delivery</text>
  </g>
</svg>`;

  fs.writeFileSync(filePath, svgContent, 'utf8');
}

// Generate files
console.log('Generating realistic image assets in backend/uploads...');

const assets = [
  // Tractors
  { file: 'tractor-mahindra-575.svg', title: 'Mahindra 575 DI Sarpanch', sub: '45 HP | 2021 | 1,480 Hours | MH Passing | Verified Engine', cat: 'Tractor', c1: '#dc2626', c2: '#f59e0b', type: 'tractor' },
  { file: 'tractor-swaraj-855.svg', title: 'Swaraj 855 FE 4WD Heavy Duty', sub: '52 HP | 2022 | 980 Hours | Power Steering | PB Passing', cat: 'Tractor', c1: '#2563eb', c2: '#38bdf8', type: 'tractor' },
  { file: 'tractor-john-deere-5050.svg', title: 'John Deere 5050 D GearPro', sub: '50 HP | 2020 | 2,100 Hours | Oil Immersed Brakes | TN Passing', cat: 'Tractor', c1: '#15803d', c2: '#eab308', type: 'tractor' },
  { file: 'tractor-sonalika-745.svg', title: 'Sonalika DI 745 III Sikander', sub: '50 HP | 2022 | 1,120 Hours | HD Bumper | UP Passing', cat: 'Tractor', c1: '#0284c7', c2: '#38bdf8', type: 'tractor' },
  { file: 'tractor-massey-241.svg', title: 'Massey Ferguson 241 DI Dynatrack', sub: '42 HP | 2021 | 1,600 Hours | High Fuel Mileage | GJ Passing', cat: 'Tractor', c1: '#b91c1c', c2: '#f97316', type: 'tractor' },
  { file: 'tractor-eicher-380.svg', title: 'Eicher 380 Super DI', sub: '40 HP | 2019 | 2,800 Hours | Single Owner | RJ Passing', cat: 'Tractor', c1: '#475569', c2: '#0284c7', type: 'tractor' },
  
  // Cars
  { file: 'car-maruti-swift.svg', title: 'Maruti Suzuki Swift VXI BS6', sub: '2021 | 38,000 km | 1st Owner | Mint Condition | MH Passing', cat: 'Car', c1: '#dc2626', c2: '#ea580c', type: 'car' },
  { file: 'car-mahindra-bolero.svg', title: 'Mahindra Bolero Power+ ZLX', sub: '2020 | 64,000 km | mHawk D70 Diesel | 7 Seater | TN Passing', cat: 'Car', c1: '#0f766e', c2: '#14b8a6', type: 'car' },
  { file: 'car-hyundai-i20.svg', title: 'Hyundai i20 Sportz 1.2 Dual Tone', sub: '2020 | 41,000 km | Touchscreen & Reverse Cam | KA Passing', cat: 'Car', c1: '#1d4ed8', c2: '#60a5fa', type: 'car' },
  { file: 'car-tata-nexon.svg', title: 'Tata Nexon XZ+ Diesel', sub: '2021 | 49,000 km | 5-Star Global NCAP Safety | DL Passing', cat: 'Car', c1: '#047857', c2: '#10b981', type: 'car' },
  { file: 'car-toyota-innova.svg', title: 'Toyota Innova Crysta 2.4 VX', sub: '2018 | 88,000 km | 7-Captain Seats | Full Dealer Records', cat: 'Car', c1: '#475569', c2: '#94a3b8', type: 'car' },
  { file: 'car-maruti-wagonr.svg', title: 'Maruti Suzuki WagonR VXI 1.2', sub: '2022 | 26,000 km | Petrol + Company CNG | 33 km/kg Mileage', cat: 'Car', c1: '#ca8a04', c2: '#facc15', type: 'car' },

  // Spare Parts
  { file: 'part-clutch-plate.svg', title: 'Heavy Duty Dual Clutch Assembly', sub: 'Luk / Rane OEM Fit for Mahindra & Swaraj Tractors', cat: 'Spare Part', c1: '#334155', c2: '#f59e0b', type: 'part' },
  { file: 'part-fuel-injector.svg', title: 'Bosch Common Rail Diesel Injector', sub: 'Genuine Bosch CRDI Kit for Swift, Bolero & Modern Diesels', cat: 'Spare Part', c1: '#1e40af', c2: '#3b82f6', type: 'part' },
  { file: 'part-hydraulic-pump.svg', title: 'Tractor Hydraulic Lift Pump & Valve', sub: 'High Pressure Hydraulic Unit for John Deere, Sonalika & Massey', cat: 'Spare Part', c1: '#15803d', c2: '#84cc16', type: 'part' },
  { file: 'part-brake-pads.svg', title: 'Ceramic Front Brake Pads Kit', sub: 'Zero Noise High Grip Pads for Swift, i20, WagonR, Baleno', cat: 'Spare Part', c1: '#b91c1c', c2: '#f97316', type: 'part' },
  { file: 'part-turbocharger.svg', title: 'Garrett OEM Turbocharger Unit', sub: 'Complete Turbo with Actuator for Mahindra Bolero & Scorpio mHawk', cat: 'Spare Part', c1: '#0f766e', c2: '#06b6d4', type: 'part' },
  { file: 'part-tractor-battery.svg', title: 'Exide Mileage 88Ah Heavy Battery', sub: 'Vibration Resistant High Cold-Cranking for Agricultural Tractors', cat: 'Spare Part', c1: '#ca8a04', c2: '#eab308', type: 'part' }
];

assets.forEach(a => {
  generateSvgAsset(a.file, a.title, a.sub, a.cat, a.c1, a.c2, a.type);
});

console.log(`Successfully generated ${assets.length} image assets in backend/uploads.`);

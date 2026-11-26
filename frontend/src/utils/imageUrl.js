// Utility to resolve image & video URLs reliably across local, Vercel, and Render deployments

// Known built-in static seed assets bundled in frontend/public/static-uploads/
const STATIC_SEEDS = new Set([
  'about-mission-yard.jpg',
  'about-stat-customers.jpg',
  'about-stat-heritage.jpg',
  'about-stat-inspection.jpg',
  'about-stat-rto.jpg',
  'balaji-logo-ai.png',
  'balaji-logo-ai.svg',
  'car-hyundai-i20.jpg',
  'car-hyundai-i20.svg',
  'car-mahindra-bolero.jpg',
  'car-mahindra-bolero.svg',
  'car-maruti-swift.jpg',
  'car-maruti-swift.svg',
  'car-maruti-wagonr.jpg',
  'car-maruti-wagonr.svg',
  'car-tata-nexon.jpg',
  'car-tata-nexon.svg',
  'car-toyota-innova.jpg',
  'car-toyota-innova.svg',
  'car.mp4',
  'favicon.svg',
  'hero-tractor-bg.jpg',
  'hero-tractor-bg-v2.jpg',
  'hero-studio-tractor.jpg',
  'part-brake-pads.jpg',
  'part-brake-pads.svg',
  'part-clutch-plate.jpg',
  'part-clutch-plate.svg',
  'part-fuel-injector.jpg',
  'part-fuel-injector.svg',
  'part-hydraulic-pump.jpg',
  'part-hydraulic-pump.svg',
  'part-tractor-battery.jpg',
  'part-tractor-battery.svg',
  'part-turbocharger.jpg',
  'part-turbocharger.svg',
  'tractor-360-0.jpg',
  'tractor-360-135.jpg',
  'tractor-360-180.jpg',
  'tractor-360-225.jpg',
  'tractor-360-270.jpg',
  'tractor-360-315.jpg',
  'tractor-360-45.jpg',
  'tractor-360-90.jpg',
  'tractor-360-video.mp4',
  'tractor-eicher-380.jpg',
  'tractor-eicher-380.svg',
  'tractor-john-deere-5050.jpg',
  'tractor-john-deere-5050.svg',
  'tractor-mahindra-575.jpg',
  'tractor-mahindra-575.svg',
  'tractor-massey-241.jpg',
  'tractor-massey-241.svg',
  'tractor-sonalika-745.jpg',
  'tractor-sonalika-745.svg',
  'tractor-swaraj-855.jpg',
  'tractor-swaraj-855.svg'
]);

export const isLocalhost = 
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' || 
   window.location.hostname === '');

export const BACKEND_URL = 
  isLocalhost
    ? ''
    : (import.meta.env.VITE_BACKEND_URL || 'https://balaji-consultancy.onrender.com');

export const resolveImageUrl = (path) => {
  if (!path) {
    return '/static-uploads/tractor-mahindra-575.jpg';
  }

  // Base64 data URLs (data:image/...)
  if (path.startsWith('data:')) {
    return path;
  }

  // Already a full external URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  let cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If already pointing to static-uploads
  if (cleanPath.startsWith('/static-uploads/')) {
    return cleanPath;
  }

  // If pointing to /uploads/
  if (cleanPath.startsWith('/uploads/')) {
    const filename = cleanPath.substring('/uploads/'.length);

    // If it is one of the built-in stock seed images, map to static-uploads for fast local serving
    if (STATIC_SEEDS.has(filename)) {
      return `/static-uploads/${filename}`;
    }

    // Otherwise, this is a dynamic user/admin-uploaded file!
    // On localhost, Vite proxies /uploads to local backend port 5000
    if (isLocalhost) {
      return cleanPath;
    }

    // On remote deployments (e.g. Vercel), prefix with Render backend URL
    if (BACKEND_URL) {
      return `${BACKEND_URL.replace(/\/+$/, '')}${cleanPath}`;
    }

    return cleanPath;
  }

  // Fallback prefix for remote server paths
  if (BACKEND_URL && !cleanPath.startsWith('/static-uploads/')) {
    return `${BACKEND_URL.replace(/\/+$/, '')}${cleanPath}`;
  }

  return cleanPath;
};

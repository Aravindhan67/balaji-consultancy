// Utility to resolve image & video URLs reliably across local, Vercel, and Render deployments

export const isLocalhost = 
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' || 
   window.location.hostname === '');

export const BACKEND_URL = 
  isLocalhost
    ? ''
    : (import.meta.env.VITE_BACKEND_URL || '');

export const resolveImageUrl = (path) => {
  if (!path) {
    return '/uploads/tractor-mahindra-575.jpg';
  }

  // Already a full external URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Local development or static bundled assets in /uploads are served directly by Vite / Vercel
  if (isLocalhost || cleanPath.startsWith('/uploads/')) {
    return cleanPath;
  }

  // Fallback prefix for remote dynamic server paths
  if (BACKEND_URL) {
    return `${BACKEND_URL}${cleanPath}`;
  }

  return cleanPath;
};

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
    return '/static-uploads/tractor-mahindra-575.jpg';
  }

  // Already a full external URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  let cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Static built-in assets located under /uploads/ are mapped to /static-uploads/
  // to avoid Vercel proxying to sleeping Render servers.
  if (cleanPath.startsWith('/uploads/')) {
    return cleanPath.replace('/uploads/', '/static-uploads/');
  }

  if (cleanPath.startsWith('/static-uploads/')) {
    return cleanPath;
  }

  // Fallback prefix for remote dynamic server paths
  if (BACKEND_URL) {
    return `${BACKEND_URL}${cleanPath}`;
  }

  return cleanPath;
};

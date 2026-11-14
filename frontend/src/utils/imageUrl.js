// Utility to resolve image URLs reliably across local, Vercel, and Render deployments

export const BACKEND_URL = 
  import.meta.env.VITE_BACKEND_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    ? 'https://balaji-consultancy.onrender.com'
    : '');

export const resolveImageUrl = (path) => {
  if (!path) {
    return BACKEND_URL 
      ? `${BACKEND_URL}/uploads/tractor-mahindra-575.jpg` 
      : '/uploads/tractor-mahindra-575.jpg';
  }

  // Already a full external URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If deployed on Vercel or external domain, prefix with Render backend URL
  if (BACKEND_URL) {
    return `${BACKEND_URL}${cleanPath}`;
  }

  // Local development fallback
  return cleanPath;
};

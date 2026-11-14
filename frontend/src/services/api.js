// Dynamic API Base URL resolution (Local Vite Proxy vs Production Render Backend)
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://balaji-consultancy.onrender.com/api';
  }
  return '/api';
};

const API_BASE = getApiBaseUrl();

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('balaji_admin_token');
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const safeJson = async (res, defaultVal = { success: false }) => {
  try {
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, status: res.status, ...errData };
    }
    return await res.json();
  } catch (err) {
    console.warn('API JSON parse error:', err);
    return defaultVal;
  }
};

export const api = {
  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '' && v !== 'all') {
          query.append(k, v);
        }
      });
      const url = `${API_BASE}/products${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetch(url);
      return await safeJson(res, { success: false, data: [] });
    } catch (err) {
      console.error('getProducts failed:', err);
      return { success: false, data: [] };
    }
  },

  async getProductById(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      return await safeJson(res, { success: false, data: null });
    } catch (err) {
      console.error('getProductById failed:', err);
      return { success: false, data: null };
    }
  },

  async createProduct(productData) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(productData)
      });
      return await safeJson(res);
    } catch (err) {
      console.error('createProduct failed:', err);
      return { success: false, message: err.message };
    }
  },

  async updateProduct(id, productData) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(productData)
      });
      return await safeJson(res);
    } catch (err) {
      console.error('updateProduct failed:', err);
      return { success: false, message: err.message };
    }
  },

  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await safeJson(res);
    } catch (err) {
      console.error('deleteProduct failed:', err);
      return { success: false, message: err.message };
    }
  },

  // Upload Images to backend
  async uploadSingleImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE}/upload/single`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData
      });
      return await safeJson(res);
    } catch (err) {
      console.error('uploadSingleImage failed:', err);
      return { success: false, message: err.message };
    }
  },

  async uploadMultipleImages(files) {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      const res = await fetch(`${API_BASE}/upload/multiple`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData
      });
      return await safeJson(res, { success: false, urls: [] });
    } catch (err) {
      console.error('uploadMultipleImages failed:', err);
      return { success: false, urls: [] };
    }
  },

  // Enquiries
  async submitEnquiry(data) {
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return await safeJson(res);
    } catch (err) {
      console.error('submitEnquiry failed:', err);
      return { success: false, message: err.message };
    }
  },

  async getEnquiries() {
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        headers: getHeaders()
      });
      return await safeJson(res, { success: false, data: [] });
    } catch (err) {
      console.error('getEnquiries failed:', err);
      return { success: false, data: [] };
    }
  },

  async updateEnquiryStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return await safeJson(res);
    } catch (err) {
      console.error('updateEnquiryStatus failed:', err);
      return { success: false, message: err.message };
    }
  },

  // Quotations
  async submitQuotation(data) {
    try {
      const res = await fetch(`${API_BASE}/quotations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return await safeJson(res);
    } catch (err) {
      console.error('submitQuotation failed:', err);
      return { success: false, message: err.message };
    }
  },

  async getQuotations() {
    try {
      const res = await fetch(`${API_BASE}/quotations`, {
        headers: getHeaders()
      });
      return await safeJson(res, { success: false, data: [] });
    } catch (err) {
      console.error('getQuotations failed:', err);
      return { success: false, data: [] };
    }
  },

  async updateQuotationStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/quotations/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return await safeJson(res);
    } catch (err) {
      console.error('updateQuotationStatus failed:', err);
      return { success: false, message: err.message };
    }
  },

  // Admin Auth & Stats
  async adminLogin(email, password) {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await safeJson(res);
    } catch (err) {
      console.error('adminLogin failed:', err);
      return { success: false, message: err.message };
    }
  },

  async getAdminMe() {
    try {
      const res = await fetch(`${API_BASE}/admin/me`, {
        headers: getHeaders()
      });
      return await safeJson(res);
    } catch (err) {
      console.error('getAdminMe failed:', err);
      return { success: false, user: null };
    }
  },

  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: getHeaders()
      });
      return await safeJson(res, { success: false });
    } catch (err) {
      console.error('getAdminStats failed:', err);
      return { success: false };
    }
  }
};

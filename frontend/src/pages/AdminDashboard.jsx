import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatINR, formatDate } from '../utils/formatters';
import { resolveImageUrl } from '../utils/imageUrl';
import { 
  Package, 
  MessageSquare, 
  FileCheck, 
  Plus, 
  Trash2, 
  Edit, 
  LogOut, 
  Upload, 
  CheckCircle2, 
  X, 
  PhoneCall, 
  RefreshCw, 
  IndianRupee,
  Layers,
  Search,
  ExternalLink,
  Camera,
  Image as ImageIcon,
  BarChart3
} from 'lucide-react';
import { Logo } from '../components/Logo';
import SpotlightCard from '../components/SpotlightCard';
import ShimmerButton from '../components/ShimmerButton';
import NumberTicker from '../components/NumberTicker';
import AdminAnalytics from '../components/AdminAnalytics';

export const AdminDashboard = () => {
  const { admin, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('inventory');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'tractor',
    subCategory: 'second_hand_vehicle',
    brand: '',
    modelYear: new Date().getFullYear(),
    price: '',
    condition: 'Excellent',
    kmOrHours: '',
    fuelType: 'Diesel',
    rtoPassing: 'Verified All-India NOC',
    ownership: '1st Owner',
    hpPower: '',
    description: '',
    location: 'Balaji Yard, Tamil Nadu',
    status: 'available',
    images: []
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDraggingImages, setIsDraggingImages] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, enqRes, quotRes] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getEnquiries(),
        api.getQuotations()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (prodRes.success) setProducts(prodRes.data);
      if (enqRes.success) setEnquiries(prodRes.data ? enqRes.data : []);
      if (quotRes.success) setQuotations(quotRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: 'tractor',
      subCategory: 'second_hand_vehicle',
      brand: 'Mahindra',
      modelYear: 2021,
      price: '',
      condition: 'Excellent',
      kmOrHours: '',
      fuelType: 'Diesel',
      rtoPassing: 'Verified All-India NOC',
      ownership: '1st Owner',
      hpPower: '45 HP',
      description: '',
      location: 'Balaji Yard, Tamil Nadu',
      status: 'available',
      images: [],
      customFields: []
    });
    setShowProductModal(true);
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    const existingSpecs = prod.specs && typeof prod.specs === 'object'
      ? Object.entries(prod.specs).map(([label, value]) => ({ label, value: String(value ?? '') }))
      : [];
    setProductForm({
      title: prod.title || '',
      category: prod.category || 'tractor',
      subCategory: prod.subCategory || 'second_hand_vehicle',
      brand: prod.brand || '',
      modelYear: prod.modelYear || 2021,
      price: prod.price || '',
      condition: prod.condition || 'Excellent',
      kmOrHours: prod.kmOrHours || '',
      fuelType: prod.fuelType || 'Diesel',
      rtoPassing: prod.rtoPassing || '',
      ownership: prod.ownership || '1st Owner',
      hpPower: prod.hpPower || '',
      description: prod.description || '',
      location: prod.location || 'Balaji Yard, Tamil Nadu',
      status: prod.status || 'available',
      images: prod.images || [],
      customFields: existingSpecs
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this vehicle and its photos from the database?')) return;
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
        loadAllData();
      } else {
        alert(res.message || 'Failed to delete product');
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const filesToUpload = Array.from(e.target.files || []);
    if (filesToUpload.length === 0) return;

    const readAsBase64 = (file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });

    setUploadingImage(true);
    try {
      if (filesToUpload.length === 1) {
        const file = filesToUpload[0];
        const res = await api.uploadSingleImage(file);
        let finalUrl = (res && res.success && res.url) ? res.url : null;
        if (!finalUrl) {
          finalUrl = await readAsBase64(file);
        }
        if (finalUrl) {
          setProductForm(prev => ({
            ...prev,
            images: [...prev.images, finalUrl]
          }));
        } else {
          alert('Could not process the selected image.');
        }
      } else {
        const res = await api.uploadMultipleImages(filesToUpload);
        let finalUrls = (res && res.success && Array.isArray(res.urls) && res.urls.length > 0) ? res.urls : null;
        if (!finalUrls || finalUrls.length === 0) {
          finalUrls = await Promise.all(filesToUpload.map(readAsBase64));
          finalUrls = finalUrls.filter(Boolean);
        }
        if (finalUrls && finalUrls.length > 0) {
          setProductForm(prev => ({
            ...prev,
            images: [...prev.images, ...finalUrls]
          }));
        } else {
          alert('Could not process the selected images.');
        }
      }
    } catch (err) {
      console.warn('Backend upload notice, using local image encoding:', err);
      try {
        const fallbackUrls = await Promise.all(filesToUpload.map(readAsBase64));
        const valid = fallbackUrls.filter(Boolean);
        if (valid.length > 0) {
          setProductForm(prev => ({
            ...prev,
            images: [...prev.images, ...valid]
          }));
        }
      } catch (_) {
        alert('Error uploading image(s): ' + err.message);
      }
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, trimmed]
    }));
    setImageUrlInput('');
  };

  const handleDropImages = async (e) => {
    e.preventDefault();
    setIsDraggingImages(false);
    const droppedFiles = Array.from(e.dataTransfer?.files || []).filter(f =>
      /\.(jpe?g|png|webp|gif)$/i.test(f.name) || f.type.startsWith('image/')
    );
    if (droppedFiles.length > 0) {
      await handleImageUpload({ target: { files: droppedFiles } });
    }
  };

  const handleAddCustomField = () => {
    setProductForm(prev => ({
      ...prev,
      customFields: [...(prev.customFields || []), { label: '', value: '' }]
    }));
  };

  const handleCustomFieldChange = (index, key, val) => {
    setProductForm(prev => ({
      ...prev,
      customFields: (prev.customFields || []).map((item, i) =>
        i === index ? { ...item, [key]: val } : item
      )
    }));
  };

  const handleRemoveCustomField = (index) => {
    setProductForm(prev => ({
      ...prev,
      customFields: (prev.customFields || []).filter((_, i) => i !== index)
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.images || productForm.images.length === 0) {
      alert('Please upload at least 1 photo for this product.');
      return;
    }

    try {
      const specsObj = {};
      (productForm.customFields || []).forEach(({ label, value }) => {
        const cleanLabel = (label || '').trim();
        const cleanValue = (value || '').trim();
        if (cleanLabel && cleanValue) {
          specsObj[cleanLabel] = cleanValue;
        }
      });

      const { customFields, ...restForm } = productForm;
      const payload = {
        ...restForm,
        specs: specsObj,
        status: productForm.status || 'available',
        price: Number(productForm.price),
        modelYear: Number(productForm.modelYear)
      };

      if (editingProduct) {
        const res = await api.updateProduct(editingProduct._id, payload);
        if (res.success) {
          setShowProductModal(false);
          loadAllData();
        }
      } else {
        const res = await api.createProduct(payload);
        if (res.success) {
          setShowProductModal(false);
          loadAllData();
        }
      }
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const handleProductStatus = async (id, status) => {
    try {
      setProducts(prev => prev.map(p => p._id === id ? { ...p, status } : p));
      const res = await api.updateProduct(id, { status });
      if (!res.success) {
        alert('Failed to update product status: ' + (res.message || 'Please try again'));
        loadAllData();
      }
    } catch (err) {
      alert('Failed to update product status');
      loadAllData();
    }
  };

  const handleEnquiryStatus = async (id, status) => {
    try {
      const res = await api.updateEnquiryStatus(id, status);
      if (res.success) {
        setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleQuotationStatus = async (id, status) => {
    try {
      const res = await api.updateQuotationStatus(id, status);
      if (res.success) {
        setQuotations(prev => prev.map(q => q._id === id ? { ...q, status } : q));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (authLoading || !isAuthenticated) {
    return <div className="p-8 text-center text-xs font-semibold">Verifying staff credentials...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] text-[#111111]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8">
        {/* Top Admin Header - User Panel Editorial Theme */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#E3DBD0] shadow-xs">
          <div className="space-y-2 w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <Logo size="small" showTagline={false} asLink={false} />
              <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-widest bg-[#EAF3EB] px-2.5 sm:px-3 py-1 rounded-full border border-[#C8E0CD]">
                Management Portal
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#6B665F] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E3DBD0]">
                Storage: {stats?.dbMode || 'Active'}
              </span>
            </div>
            <h1 className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-[#111111] tracking-tight">
              Balaji Auto &amp; Agro Administration
            </h1>
            <p className="text-xs text-[#6B665F] break-all sm:break-normal">
              Logged in as <strong className="text-[#111111]">{admin?.email}</strong> ({admin?.role})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="taste-btn flex items-center gap-1.5 bg-[#FAF8F5] hover:bg-[#EAE3D7] text-[#111111] font-bold text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#E3DBD0] transition-colors"
              title="Open customer website in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>View Public Site</span>
            </a>
            <button
              onClick={loadAllData}
              className="p-2 sm:p-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#EAE3D7] text-[#111111] transition-colors border border-[#E3DBD0] cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 sm:gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Analytics Metric Cards - User Panel SpotlightCards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <SpotlightCard className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3DBD0] shadow-xs hover:border-[#2E7D32]/60">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#6B665F] uppercase tracking-wider">Total Inventory</div>
            <div className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-[#111111] mt-1">
              <NumberTicker value={products.filter(p => p && p.category !== 'spare_part').length} />
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#2E7D32] font-bold mt-1 leading-snug">
              {products.filter(p => p.category === 'tractor').length} Tractors • {products.filter(p => p.category === 'car').length} Cars • {products.filter(p => p.category === 'truck').length} Trucks
            </div>
          </SpotlightCard>

          <SpotlightCard className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3DBD0] shadow-xs hover:border-[#2E7D32]/60">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#6B665F] uppercase tracking-wider">Total Yard Valuation</div>
            <div className="font-heading font-black text-lg sm:text-2xl lg:text-3xl text-[#2E7D32] mt-1 break-words">
              {formatINR(products.filter(p => p && p.category !== 'spare_part').reduce((s, p) => s + (Number(p.price) || 0), 0))}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#6B665F] mt-1">Live active assets</div>
          </SpotlightCard>

          <SpotlightCard className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3DBD0] shadow-xs hover:border-[#2E7D32]/60">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#6B665F] uppercase tracking-wider">Customer Enquiries</div>
            <div className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-[#111111] mt-1">
              <NumberTicker value={enquiries.length} />
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#2E7D32] font-bold mt-1">
              {enquiries.filter(e => e.status === 'new').length} New Pending Action
            </div>
          </SpotlightCard>

          <SpotlightCard className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3DBD0] shadow-xs hover:border-[#2E7D32]/60">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#6B665F] uppercase tracking-wider">Vehicle Quotations</div>
            <div className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-[#D97706] mt-1">
              <NumberTicker value={quotations.length} />
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#B45309] font-bold mt-1">
              {quotations.filter(q => q.status === 'pending').length} Awaiting Valuation
            </div>
          </SpotlightCard>
        </div>

        {/* Pill Tab Navigation (2x2 Grid on Mobile, Wrapped Pills on Tablet/Desktop) */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 bg-white p-2 rounded-2xl border border-[#E3DBD0] shadow-xs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full sm:w-auto justify-center px-2.5 sm:px-4 py-2.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-[#6B665F] hover:text-[#111111] hover:bg-[#FAF8F5]'
            }`}
          >
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full sm:w-auto justify-center px-2.5 sm:px-4 py-2.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-[#6B665F] hover:text-[#111111] hover:bg-[#FAF8F5]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Analytics &amp; Graphs</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full sm:w-auto justify-center px-2.5 sm:px-4 py-2.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'enquiries'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-[#6B665F] hover:text-[#111111] hover:bg-[#FAF8F5]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Enquiries ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quotations')}
            className={`w-full sm:w-auto justify-center px-2.5 sm:px-4 py-2.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'quotations'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-[#6B665F] hover:text-[#111111] hover:bg-[#FAF8F5]'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Valuations ({quotations.length})</span>
          </button>
        </div>

        {/* TAB 0: ANALYTICS & GRAPHS */}
        {activeTab === 'analytics' && (
          <AdminAnalytics products={products} enquiries={enquiries} quotations={quotations} />
        )}

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-heading font-bold text-[#111111] text-lg">Manage Stock</h2>
            <ShimmerButton
              onClick={handleAddNew}
              variant="primary"
              className="w-full sm:w-auto px-5 py-2.5 shadow-xs justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </ShimmerButton>
          </div>

          {/* Mobile Card List (No horizontal scroll on phones) */}
          <div className="md:hidden space-y-3">
            {products.map((prod) => (
              <div key={prod._id} className="bg-white rounded-2xl border border-[#E3DBD0] p-4 shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-14 rounded-xl bg-slate-100 overflow-hidden border border-[#E3DBD0] shrink-0">
                    <img
                      src={resolveImageUrl(prod.images?.[0]) || '/uploads/tractor-mahindra-575.jpg'}
                      alt={prod.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        prod.category === 'tractor' ? 'bg-amber-100 text-amber-800' :
                        prod.category === 'car' ? 'bg-blue-100 text-blue-800' :
                        prod.category === 'truck' ? 'bg-indigo-100 text-indigo-800' :
                        prod.category === 'agro_equipment' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-teal-100 text-teal-800'
                      }`}>
                        {prod.category === 'agro_equipment' ? 'Agro Equipment' : prod.category}
                      </span>
                      <span className="text-[11px] font-bold text-[#2E7D32]">{formatINR(prod.price)}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm leading-snug">{prod.title}</div>
                    <div className="text-[11px] text-[#6B665F] mt-0.5">
                      {prod.brand} • {prod.modelYear} • {prod.kmOrHours || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F0EBE3]">
                  <select
                    value={prod.status || 'available'}
                    onChange={(e) => handleProductStatus(prod._id, e.target.value)}
                    className={`text-[11px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer outline-none ${
                      (prod.status || 'available') === 'available'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : prod.status === 'sold'
                        ? 'bg-rose-50 text-rose-800 border-rose-300'
                        : prod.status === 'reserved'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-blue-50 text-blue-800 border-blue-300'
                    }`}
                  >
                    <option value="available">🟢 Available</option>
                    <option value="reserved">🟡 Reserved</option>
                    <option value="sold">🔴 Sold Out</option>
                    <option value="under_inspection">🔵 Inspection</option>
                  </select>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod._id)}
                      className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                      title="Delete from stock"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop & Tablet Table */}
          <div className="hidden md:block bg-white rounded-3xl border border-[#E3DBD0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Title &amp; Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Year / Run</th>
                    <th className="py-3 px-4">RTO State</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-12 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                          <img
                            src={prod.images?.[0] || '/uploads/tractor-mahindra-575.jpg'}
                            alt={prod.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{prod.title}</div>
                        <div className="text-[11px] text-slate-400">{prod.brand}</div>
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.category === 'tractor' ? 'bg-amber-100 text-amber-800' :
                          prod.category === 'car' ? 'bg-blue-100 text-blue-800' :
                          prod.category === 'truck' ? 'bg-indigo-100 text-indigo-800' :
                          prod.category === 'agro_equipment' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-teal-100 text-teal-800'
                        }`}>
                          {prod.category === 'agro_equipment' ? 'Agro Equipment' : prod.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-800">
                        {formatINR(prod.price)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {prod.modelYear} • {prod.kmOrHours || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {prod.rtoPassing || 'Verified'}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={prod.status || 'available'}
                          onChange={(e) => handleProductStatus(prod._id, e.target.value)}
                          className={`text-[11px] font-bold uppercase tracking-wider rounded-lg px-2 py-1 border transition-all cursor-pointer outline-none ${
                            (prod.status || 'available') === 'available'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 focus:ring-1 focus:ring-emerald-500'
                              : prod.status === 'sold'
                              ? 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100 focus:ring-1 focus:ring-rose-500'
                              : prod.status === 'reserved'
                              ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 focus:ring-1 focus:ring-amber-500'
                              : 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100 focus:ring-1 focus:ring-blue-500'
                          }`}
                        >
                          <option value="available" className="bg-white text-emerald-800 font-bold">🟢 Available</option>
                          <option value="reserved" className="bg-white text-amber-800 font-bold">🟡 Reserved</option>
                          <option value="sold" className="bg-white text-rose-800 font-bold">🔴 Sold Out</option>
                          <option value="under_inspection" className="bg-white text-blue-800 font-bold">🔵 Inspection</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(prod)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit Vehicle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete from stock"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-[#111111] text-lg">Customer Leads &amp; Messages</h2>
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E3DBD0] shadow-xs overflow-hidden">
            {enquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No enquiries received yet.</div>
            ) : (
              <div className="divide-y divide-[#F0EBE3]">
                {enquiries.map((enq) => (
                  <div key={enq._id} className="p-4 sm:p-5 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{enq.name}</span>
                        <span className="text-xs text-slate-400">• {formatDate(enq.createdAt)}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          enq.status === 'new' ? 'bg-red-100 text-red-800' :
                          enq.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          'bg-teal-100 text-teal-800'
                        }`}>
                          {enq.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold text-blue-800">Ph: {enq.phone}</span>
                        {enq.city && <span>City: {enq.city}</span>}
                        {enq.productTitle && <span className="text-amber-800 font-bold">Regarding: {enq.productTitle}</span>}
                      </div>
                      <p className="text-xs text-slate-700 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E3DBD0] mt-2 break-words">
                        "{enq.message}"
                      </p>
                    </div>

                    <div className="flex flex-wrap md:flex-col items-center md:items-end justify-between gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EBE3]">
                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${enq.name},%20this%20is%20Balaji%20Auto%20&%20Agro%20Consultancy%20regarding%20your%20enquiry.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          Call
                        </a>
                      </div>

                      <select
                        value={enq.status}
                        onChange={(e) => handleEnquiryStatus(enq._id, e.target.value)}
                        className="text-[11px] font-semibold bg-[#FAF8F5] border border-[#E3DBD0] rounded-lg px-2.5 py-1.5"
                      >
                        <option value="new">Mark New</option>
                        <option value="contacted">Mark Contacted</option>
                        <option value="closed">Mark Closed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: QUOTATION REQUESTS */}
      {activeTab === 'quotations' && (
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-[#111111] text-lg">Vehicle Valuation &amp; Sell Quotes</h2>
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E3DBD0] shadow-xs overflow-hidden">
            {quotations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No quotation requests yet.</div>
            ) : (
              <div className="divide-y divide-[#F0EBE3]">
                {quotations.map((q) => (
                  <div key={q._id} className="p-4 sm:p-5 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{q.name}</span>
                        <span className="text-xs text-slate-400">• {formatDate(q.createdAt)}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                          {q.type.replace('_', ' ')}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          q.status === 'pending' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {q.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700">
                        <strong>Vehicle:</strong> {q.brand} {q.modelName} ({q.year} Model) • <strong>Expected:</strong> {q.expectedPrice || 'Open to Offer'}
                      </div>
                      <div className="text-xs text-slate-500">
                        Contact: {q.phone} • City: {q.city} • Condition: {q.condition}
                      </div>
                      {q.notes && (
                        <p className="text-xs text-slate-600 italic bg-[#FAF8F5] border border-[#E3DBD0] p-2.5 rounded-xl break-words">
                          "{q.notes}"
                        </p>
                      )}

                      {/* Display Photos Uploaded to Backend */}
                      {q.photos && q.photos.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {q.photos.map((photoUrl, idx) => (
                            <a
                              key={idx}
                              href={photoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-14 h-14 rounded-lg overflow-hidden border border-[#E3DBD0] block"
                            >
                              <img src={photoUrl} alt="machine" className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap md:flex-col items-center md:items-end justify-between gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EBE3]">
                      <a
                        href={`https://wa.me/91${q.phone.replace(/[^0-9]/g, '')}?text=Hello%20${q.name},%20we%20reviewed%20your%20${q.brand}%20${q.modelName}%20quotation%20request.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reply WhatsApp
                      </a>

                      <select
                        value={q.status}
                        onChange={(e) => handleQuotationStatus(q._id, e.target.value)}
                        className="text-[11px] font-semibold bg-[#FAF8F5] border border-[#E3DBD0] rounded-lg px-2.5 py-1.5"
                      >
                        <option value="pending">Pending</option>
                        <option value="evaluated">Evaluated</option>
                        <option value="deal_made">Deal Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-slate-900 text-lg">
                {editingProduct ? 'Edit Vehicle / Part' : 'Add New Inventory Item'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2021 Mahindra 575 DI Sarpanch (45 HP)"
                  value={productForm.title}
                  onChange={(e) => setProductForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5"
                  >
                    <option value="tractor">🚜 Tractor</option>
                    <option value="car">🚗 Car</option>
                    <option value="truck">🚚 Truck</option>
                    <option value="agro_equipment">🌾 Tractor Agro Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Status *</label>
                  <select
                    value={productForm.status || 'available'}
                    onChange={(e) => setProductForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold"
                  >
                    <option value="available">🟢 Available (In Stock)</option>
                    <option value="reserved">🟡 Reserved / Booked</option>
                    <option value="sold">🔴 Sold Out</option>
                    <option value="under_inspection">🔵 Under Inspection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahindra, Swaraj, Maruti, Bosch"
                    value={productForm.brand}
                    onChange={(e) => setProductForm(p => ({ ...p, brand: e.target.value }))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 465000"
                    value={productForm.price}
                    onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Model Year</label>
                  <input
                    type="number"
                    value={productForm.modelYear}
                    onChange={(e) => setProductForm(p => ({ ...p, modelYear: e.target.value }))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">HP / Power</label>
                  <input
                    type="text"
                    placeholder="e.g. 45 HP or 89 BHP"
                    value={productForm.hpPower}
                    onChange={(e) => setProductForm(p => ({ ...p, hpPower: e.target.value }))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hours / KMs Run</label>
                  <input
                    type="text"
                    placeholder="e.g. 1,480 Hours or 42,000 km"
                    value={productForm.kmOrHours}
                    onChange={(e) => setProductForm(p => ({ ...p, kmOrHours: e.target.value }))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">RTO State Passing</label>
                  <input
                    type="text"
                    placeholder="e.g. TN-34 or All-India NOC"
                    value={productForm.rtoPassing}
                    onChange={(e) => setProductForm(p => ({ ...p, rtoPassing: e.target.value }))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5"
                  />
                </div>
              </div>

              {/* Product Photos Upload (Unlimited Photos, Min 1) */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingImages(true); }}
                onDragLeave={() => setIsDraggingImages(false)}
                onDrop={handleDropImages}
                className={`space-y-2.5 p-3.5 sm:p-4 rounded-2xl border transition-colors ${
                  isDraggingImages
                    ? 'bg-[#EAF3EB]/60 border-[#2E7D32] border-dashed'
                    : 'bg-slate-50/80 border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Product Photos <span className="text-red-500">*</span>
                      <span className="text-[11px] font-normal text-slate-500 ml-1.5">(Min 1, Unlimited)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Choose files, drag &amp; drop photos here, or paste an image URL below.
                    </p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    productForm.images.length >= 1
                      ? 'bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/30'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {productForm.images.length} Selected
                  </span>
                </div>

                {/* Native Accessible File Input (Explicit extensions prevent Windows/OneDrive Chrome picker hang) */}
                <input
                  id="admin-product-photo-input"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,.gif"
                  onChange={handleImageUpload}
                  className="sr-only"
                />

                {/* Unlimited Photo Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {productForm.images.map((rawUrl, slotIdx) => {
                    const imgUrl = resolveImageUrl(rawUrl);
                    return (
                      <div key={slotIdx} className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-300 bg-white shadow-xs group">
                        <img
                          src={imgUrl}
                          alt={`Photo ${slotIdx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/static-uploads/tractor-mahindra-575.jpg';
                          }}
                        />
                        <span className="absolute top-1.5 left-1.5 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          {slotIdx === 0 ? '★ Cover' : `#${slotIdx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(slotIdx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Always-available Add More Photos Tile */}
                  <label
                    htmlFor="admin-product-photo-input"
                    className={`relative aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-[#2E7D32] hover:bg-white text-slate-400 hover:text-[#2E7D32] flex flex-col items-center justify-center gap-1 transition-all p-2 cursor-pointer ${
                      uploadingImage ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-[10px] font-bold text-center">
                      {productForm.images.length === 0 ? '+ Cover Photo' : '+ Add More'}
                    </span>
                  </label>
                </div>

                {/* Upload Actions & Quick URL Fallback */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="admin-product-photo-input"
                        className={`inline-flex items-center gap-1.5 text-xs font-bold bg-[#2E7D32] hover:bg-[#236628] text-white px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          uploadingImage ? 'bg-slate-300 pointer-events-none' : ''
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingImage ? 'Uploading Photos...' : 'Add Photos (Unlimited)'}
                      </label>
                      {uploadingImage && (
                        <span className="text-xs text-[#2E7D32] font-semibold animate-pulse">
                          Uploading to storage...
                        </span>
                      )}
                    </div>

                    {productForm.images.length === 0 && (
                      <span className="text-[11px] text-amber-700 font-medium">
                        ⚠️ Minimum 1 photo required
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="flex-1 min-w-0 text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:border-[#2E7D32]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="shrink-0 text-xs font-bold bg-white hover:bg-[#EAF3EB] text-[#2E7D32] border border-[#2E7D32]/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Specifications / Label & Value Fields */}
              <div className="space-y-2.5 p-3.5 sm:p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      Custom Labels &amp; Details
                      <span className="text-[11px] font-normal text-slate-500 ml-1.5">(Shown on User Product Page)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Add custom label and value pairs (e.g. Tyre Condition: 85%, Insurance: Valid, Battery: New Exide).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1 text-xs font-bold bg-[#111111] hover:bg-[#2E7D32] text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Field
                  </button>
                </div>

                {(productForm.customFields || []).length > 0 && (
                  <div className="space-y-2 pt-1">
                    {productForm.customFields.map((field, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white sm:bg-transparent p-2 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
                        <input
                          type="text"
                          placeholder="Label (e.g. Tyre Condition)"
                          value={field.label}
                          onChange={(e) => handleCustomFieldChange(idx, 'label', e.target.value)}
                          className="sm:col-span-5 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:border-[#2E7D32]"
                        />
                        <div className="sm:col-span-7 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Value (e.g. 85% MRF Lug)"
                            value={field.value}
                            onChange={(e) => handleCustomFieldChange(idx, 'value', e.target.value)}
                            className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-[#2E7D32]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomField(idx)}
                            className="h-8 w-8 shrink-0 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                            title="Remove field"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5"
                ></textarea>
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#E3DBD0] text-xs font-bold text-[#111111] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <ShimmerButton
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto px-6 py-2.5 shadow-sm justify-center"
                >
                  <span>{editingProduct ? 'Update Vehicle' : 'Add to Stock'}</span>
                </ShimmerButton>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

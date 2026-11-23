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
  Image as ImageIcon
} from 'lucide-react';

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
    images: []
  });

  const [uploadingImage, setUploadingImage] = useState(false);

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
      images: []
    });
    setShowProductModal(true);
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
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
      images: prod.images || []
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle/part from inventory?')) return;
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
        loadAllData();
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentImages = productForm.images || [];
    const remainingSlots = 4 - currentImages.length;

    if (remainingSlots <= 0) {
      alert('You have already added 4 photos (maximum 4 photos allowed per product). Please remove an existing photo to upload a new one.');
      if (e.target) e.target.value = '';
      return;
    }

    if (files.length > remainingSlots) {
      alert(`Only ${remainingSlots} more photo(s) can be added (maximum 4 photos per product). Uploading the first ${remainingSlots} selected.`);
    }

    const filesToUpload = files.slice(0, remainingSlots);

    setUploadingImage(true);
    try {
      if (filesToUpload.length === 1) {
        const res = await api.uploadSingleImage(filesToUpload[0]);
        if (res.success && res.url) {
          setProductForm(prev => ({
            ...prev,
            images: [...prev.images, res.url]
          }));
        } else {
          alert(res.message || 'Image upload failed');
        }
      } else {
        const res = await api.uploadMultipleImages(filesToUpload);
        if (res.success && Array.isArray(res.urls) && res.urls.length > 0) {
          setProductForm(prev => ({
            ...prev,
            images: [...prev.images, ...res.urls]
          }));
        } else {
          alert(res.message || 'Multiple images upload failed');
        }
      }
    } catch (err) {
      alert('Error uploading image(s): ' + err.message);
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

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.images || productForm.images.length === 0) {
      alert('Please upload at least 1 photo for this product (minimum 1, maximum 4 photos required).');
      return;
    }
    if (productForm.images.length > 4) {
      alert('Maximum 4 photos allowed per product. Please remove extra photos.');
      return;
    }

    try {
      const payload = {
        ...productForm,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-[#1a1f26] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl border border-[#2e3744]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-950 uppercase tracking-widest bg-gradient-to-r from-amber-400 to-amber-300 px-3 py-1 rounded-full shadow-sm">
              Management Portal
            </span>
            <span className="text-xs text-stone-300">
              Storage: {stats?.dbMode || 'Active'}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl mt-2">
            Balaji Auto &amp; Agro Administration
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Logged in as {admin?.email} ({admin?.role})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/15 transition-colors"
            title="Open customer website in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </a>
          <button
            onClick={loadAllData}
            className="p-2.5 rounded-xl bg-[#28313e] hover:bg-[#374456] text-stone-200 transition-colors border border-white/10"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#e7ded2] shadow-sm">
          <div className="text-xs font-semibold text-[#8c827a] uppercase">Total Inventory</div>
          <div className="font-heading font-black text-2xl text-[#1a1f26] mt-1">
            {stats?.totalProducts || products.length}
          </div>
          <div className="text-[11px] text-[#c85a17] font-bold mt-1">
            {stats?.tractorsCount || 0} Tractors • {stats?.carsCount || 0} Cars • {stats?.sparesCount || 0} Spares
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e7ded2] shadow-sm">
          <div className="text-xs font-semibold text-[#8c827a] uppercase">Total Yard Valuation</div>
          <div className="font-heading font-black text-2xl text-[#c85a17] mt-1">
            {formatINR(stats?.totalInventoryValue || 0)}
          </div>
          <div className="text-[11px] text-[#6b7280] mt-1">Live active assets</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e7ded2] shadow-sm">
          <div className="text-xs font-semibold text-[#8c827a] uppercase">Customer Enquiries</div>
          <div className="font-heading font-black text-2xl text-[#1e5144] mt-1">
            {enquiries.length}
          </div>
          <div className="text-[11px] text-[#1e5144] font-semibold mt-1">
            {enquiries.filter(e => e.status === 'new').length} New Pending Action
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e7ded2] shadow-sm">
          <div className="text-xs font-semibold text-[#8c827a] uppercase">Vehicle Quotations</div>
          <div className="font-heading font-black text-2xl text-[#d97706] mt-1">
            {quotations.length}
          </div>
          <div className="text-[11px] text-[#b45309] font-semibold mt-1">
            {quotations.filter(q => q.status === 'pending').length} Awaiting Valuation
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#e7ded2] gap-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'inventory'
              ? 'border-[#c85a17] text-[#c85a17] font-black'
              : 'border-transparent text-[#6b7280] hover:text-[#1a1f26]'
          }`}
        >
          <Package className="w-4 h-4" />
          Vehicle &amp; Spares Inventory ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'enquiries'
              ? 'border-[#c85a17] text-[#c85a17] font-black'
              : 'border-transparent text-[#6b7280] hover:text-[#1a1f26]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Customer Enquiries ({enquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('quotations')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'quotations'
              ? 'border-[#c85a17] text-[#c85a17] font-black'
              : 'border-transparent text-[#6b7280] hover:text-[#1a1f26]'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Valuation Requests ({quotations.length})
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold text-slate-900 text-lg">Manage Stock</h2>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-[#c85a17] hover:bg-[#b04a0b] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle / Spare Part
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                          'bg-teal-100 text-teal-800'
                        }`}>
                          {prod.category}
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
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.status === 'available' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {prod.status}
                        </span>
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
          <h2 className="font-heading font-bold text-slate-900 text-lg">Customer Leads &amp; Messages</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {enquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No enquiries received yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {enquiries.map((enq) => (
                  <div key={enq._id} className="p-5 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
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
                      <div className="text-xs text-slate-600 flex items-center gap-3">
                        <span className="font-semibold text-blue-800">Ph: {enq.phone}</span>
                        {enq.city && <span>City: {enq.city}</span>}
                        {enq.productTitle && <span className="text-amber-800 font-bold">Regarding: {enq.productTitle}</span>}
                      </div>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                        "{enq.message}"
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-end justify-between gap-2">
                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${enq.name},%20this%20is%20Balaji%20Auto%20&%20Agro%20Consultancy%20regarding%20your%20enquiry.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="bg-slate-900 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          Call
                        </a>
                      </div>

                      <select
                        value={enq.status}
                        onChange={(e) => handleEnquiryStatus(enq._id, e.target.value)}
                        className="text-[11px] font-semibold bg-slate-100 border border-slate-200 rounded-lg px-2 py-1"
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
          <h2 className="font-heading font-bold text-slate-900 text-lg">Vehicle Valuation &amp; Sell Quotes</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {quotations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No quotation requests yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {quotations.map((q) => (
                  <div key={q._id} className="p-5 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
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
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg">
                          "{q.notes}"
                        </p>
                      )}

                      {/* Display Photos Uploaded to Backend */}
                      {q.photos && q.photos.length > 0 && (
                        <div className="flex gap-2 pt-2">
                          {q.photos.map((photoUrl, idx) => (
                            <a
                              key={idx}
                              href={photoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 block"
                            >
                              <img src={photoUrl} alt="machine" className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row md:flex-col items-end justify-between gap-2">
                      <a
                        href={`https://wa.me/91${q.phone.replace(/[^0-9]/g, '')}?text=Hello%20${q.name},%20we%20reviewed%20your%20${q.brand}%20${q.modelName}%20quotation%20request.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reply WhatsApp
                      </a>

                      <select
                        value={q.status}
                        onChange={(e) => handleQuotationStatus(q._id, e.target.value)}
                        className="text-[11px] font-semibold bg-slate-100 border border-slate-200 rounded-lg px-2 py-1"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5"
                  >
                    <option value="tractor">🚜 Tractor</option>
                    <option value="car">🚗 Car</option>
                    <option value="spare_part">⚙️ Spare Part</option>
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

              <div className="grid grid-cols-3 gap-3">
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

              <div className="grid grid-cols-2 gap-3">
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

              {/* Product Photos Upload (Min 1, Max 4 Photos) */}
              <div className="space-y-2.5 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      Product Photos <span className="text-red-500">*</span>
                      <span className="text-[11px] font-normal text-slate-500 ml-1.5">(Min 1, Max 4 Photos)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Upload 1 to 4 photos. These will be displayed in the product details page with interactive scroll.
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    productForm.images.length >= 1 && productForm.images.length <= 4
                      ? 'bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/30'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {productForm.images.length} / 4 Selected
                  </span>
                </div>

                {/* Hidden File Input (Supports Multiple) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* 4 Interactive Photo Slots */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const hasImage = slotIdx < productForm.images.length;
                    const rawUrl = hasImage ? productForm.images[slotIdx] : null;
                    const imgUrl = rawUrl ? resolveImageUrl(rawUrl) : null;

                    if (hasImage) {
                      return (
                        <div key={slotIdx} className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-300 bg-white shadow-xs group">
                          <img src={imgUrl} alt={`Photo ${slotIdx + 1}`} className="w-full h-full object-cover" />
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
                    }

                    // Empty slot
                    return (
                      <button
                        key={slotIdx}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="relative aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-[#2E7D32] hover:bg-white text-slate-400 hover:text-[#2E7D32] flex flex-col items-center justify-center gap-1 transition-all p-2 cursor-pointer disabled:opacity-50"
                      >
                        <Camera className="w-5 h-5" />
                        <span className="text-[10px] font-bold">
                          {slotIdx === 0 ? '+ Cover Photo' : `+ Photo #${slotIdx + 1}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Upload Actions & Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage || productForm.images.length >= 4}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#2E7D32] hover:bg-[#236628] disabled:bg-slate-300 text-white px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingImage ? 'Uploading Photos...' : 'Choose Photos (1 to 4)'}
                    </button>
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

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#c85a17] text-white text-xs font-bold hover:bg-[#b04a0b] shadow-md transition-all"
                >
                  {editingProduct ? 'Update Vehicle' : 'Add to Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

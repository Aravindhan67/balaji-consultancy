import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Enquiry } from '../models/Enquiry.js';
import { Quotation } from '../models/Quotation.js';
import { Review } from '../models/Review.js';
import { initialProducts } from '../seed/initialData.js';
import { deleteFromCloudinaryByUrl } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, 'db.json');
const uploadsDir = path.join(__dirname, '..', 'uploads');

const PROTECTED_UPLOAD_PREFIXES = ['balaji-logo', 'favicon', 'hero-', 'about-', 'tractor-360-'];

/**
 * Extract local /uploads/<filename> basename if the URL points to backend/uploads.
 */
const extractUploadFilename = (imgUrl) => {
  if (!imgUrl || typeof imgUrl !== 'string') return null;
  if (imgUrl.startsWith('data:')) return null;
  const cleanUrl = imgUrl.split('?')[0].split('#')[0];
  const match = cleanUrl.match(/\/uploads\/([^/]+)$/i);
  if (!match) return null;
  const filename = path.basename(match[1]);
  if (!filename || PROTECTED_UPLOAD_PREFIXES.some((prefix) => filename.startsWith(prefix))) {
    return null;
  }
  return filename;
};

/**
 * Permanently delete local upload files and Cloudinary assets that are no longer referenced by any product in the database.
 */
const cleanupOrphanedProductImages = async (candidateImages = []) => {
  if (!Array.isArray(candidateImages) || candidateImages.length === 0) return;

  const uniqueCandidates = [...new Set(candidateImages.filter((u) => typeof u === 'string' && u.trim()))];
  if (uniqueCandidates.length === 0) return;

  try {
    let remainingProducts = [];
    if (isMongoConnected()) {
      remainingProducts = await Product.find({}, 'images').lean();
    } else {
      remainingProducts = fileDb.products || [];
    }

    const stillReferencedUrls = new Set();
    const stillReferencedFilenames = new Set();
    remainingProducts.forEach((p) => {
      if (Array.isArray(p?.images)) {
        p.images.forEach((img) => {
          if (typeof img === 'string') stillReferencedUrls.add(img);
          const fname = extractUploadFilename(img);
          if (fname) stillReferencedFilenames.add(fname);
        });
      }
    });

    const resolvedUploadsDir = path.resolve(uploadsDir);
    for (const imgUrl of uniqueCandidates) {
      if (imgUrl.includes('res.cloudinary.com')) {
        if (!stillReferencedUrls.has(imgUrl)) {
          await deleteFromCloudinaryByUrl(imgUrl);
        }
        continue;
      }

      const fname = extractUploadFilename(imgUrl);
      if (!fname || stillReferencedFilenames.has(fname)) continue;
      const filePath = path.resolve(resolvedUploadsDir, fname);
      if (!filePath.startsWith(resolvedUploadsDir + path.sep)) continue;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (err) {
    console.error('Error cleaning up deleted product photos:', err.message);
  }
};

export const initialReviews = [
  {
    _id: 'rev_1',
    name: 'Senthil Saravanan',
    role: 'Sugarcane Farmer',
    location: 'Salem (Tamil Nadu)',
    vehicleOrService: 'Swaraj 855 FE',
    rating: 5,
    comment: 'I was looking for a pre-owned Swaraj 855 for my 15-acre sugarcane farm. Balaji Consultancy gave me a certified tractor with genuine hours and handled all the RTO transfer from Punjab to Tamil Nadu smoothly. Very honest service!',
    verified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    _id: 'rev_2',
    name: 'Rajeshwar Patil',
    role: 'Transport Fleet Owner',
    location: 'Pune (Maharashtra)',
    vehicleOrService: 'Mahindra Bolero Maxi Truck',
    rating: 5,
    comment: 'Sold my 2018 Mahindra Bolero through Balaji Consultancy. Within 3 days they found a buyer at my expected valuation and the payment was credited to my bank instantly. Highly recommended.',
    verified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
  },
  {
    _id: 'rev_3',
    name: 'Manpreet Singh Kahlon',
    role: 'Agricultural Contractor',
    location: 'Ludhiana (Punjab)',
    vehicleOrService: 'Genuine OEM Spares',
    rating: 5,
    comment: 'Finding genuine Bosch diesel injectors and tractor clutch plates at reasonable rates was difficult in our local market. Balaji\'s spare parts division sent OEM parts with warranty. Saved me over ₹15,000!',
    verified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString()
  }
];

// Memory/File-based fallback store
let fileDb = {
  products: [],
  enquiries: [],
  quotations: [],
  reviews: []
};

// Check if Mongoose is connected
export const isMongoConnected = () => mongoose.connection.readyState === 1;

// Load file-based fallback
export const initFallbackDb = () => {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf8');
      fileDb = JSON.parse(raw);
      if (!Array.isArray(fileDb.reviews) || fileDb.reviews.length === 0) {
        fileDb.reviews = [...initialReviews];
        saveFallbackDb();
      }
    } else {
      fileDb = {
        products: initialProducts.map((p, idx) => ({
          _id: `prod_${idx + 1}`,
          ...p,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
        enquiries: [],
        quotations: [],
        reviews: [...initialReviews]
      };
      saveFallbackDb();
    }
  } catch (err) {
    console.error('Error loading fallback db:', err.message);
  }
};

const saveFallbackDb = () => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(fileDb, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving fallback db:', err.message);
  }
};

// Seed MongoDB if empty
export const seedMongoIfEmpty = async () => {
  if (!isMongoConnected()) return;
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('MongoDB connected. Seeding initial automotive & tractor inventory...');
      await Product.insertMany(initialProducts);
      console.log(`Seeded ${initialProducts.length} items to MongoDB.`);
    }
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.insertMany(initialReviews.map(({ _id, ...r }) => r));
      console.log(`Seeded ${initialReviews.length} initial reviews to MongoDB.`);
    }
  } catch (err) {
    console.error('Failed to seed MongoDB:', err.message);
  }
};

const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// --- DATA ACCESS LAYER ---
export const DataStore = {
  // PRODUCTS
  async getProducts(filter = {}) {
    if (isMongoConnected()) {
      const query = {};
      if (filter.category && filter.category !== 'all') {
        query.category = String(filter.category);
      }
      if (filter.brand && filter.brand !== 'all') {
        query.brand = new RegExp(`^${escapeRegex(filter.brand)}$`, 'i');
      }
      if (filter.search) {
        const safeSearch = new RegExp(escapeRegex(filter.search), 'i');
        query.$or = [
          { title: safeSearch },
          { brand: safeSearch },
          { description: safeSearch },
          { rtoPassing: safeSearch }
        ];
      }
      if (filter.minPrice) query.price = { ...(query.price || {}), $gte: Number(filter.minPrice) };
      if (filter.maxPrice) query.price = { ...(query.price || {}), $lte: Number(filter.maxPrice) };
      if (filter.featured !== undefined) query.featured = filter.featured === 'true' || filter.featured === true;
      if (filter.status && filter.status !== 'all') {
        query.status = filter.status;
      }

      return await Product.find(query).sort({ createdAt: -1 });
    }

    // Fallback store
    let items = [...fileDb.products];
    if (filter.status && filter.status !== 'all') {
      items = items.filter(p => (p.status || 'available') === filter.status);
    }
    if (filter.category && filter.category !== 'all') {
      items = items.filter(p => p.category === filter.category);
    }
    if (filter.brand && filter.brand !== 'all') {
      items = items.filter(p => p.brand && p.brand.toLowerCase() === filter.brand.toLowerCase());
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      items = items.filter(p => 
        (p.title && p.title.toLowerCase().includes(s)) ||
        (p.brand && p.brand.toLowerCase().includes(s)) ||
        (p.description && p.description.toLowerCase().includes(s)) ||
        (p.rtoPassing && p.rtoPassing.toLowerCase().includes(s))
      );
    }
    if (filter.minPrice) {
      items = items.filter(p => p.price >= Number(filter.minPrice));
    }
    if (filter.maxPrice) {
      items = items.filter(p => p.price <= Number(filter.maxPrice));
    }
    if (filter.featured !== undefined) {
      const isFeat = filter.featured === 'true' || filter.featured === true;
      items = items.filter(p => p.featured === isFeat);
    }
    return items.reverse();
  },

  async getProductById(id) {
    if (isMongoConnected()) {
      return await Product.findById(id);
    }
    return fileDb.products.find(p => p._id === id || String(p.id) === String(id));
  },

  async createProduct(data) {
    if (isMongoConnected()) {
      const prod = new Product({
        status: data.status || 'available',
        ...data
      });
      return await prod.save();
    }
    const newProd = {
      _id: `prod_${Date.now()}`,
      status: data.status || 'available',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    fileDb.products.push(newProd);
    saveFallbackDb();
    return newProd;
  },

  async updateProduct(id, data) {
    if (isMongoConnected()) {
      const existing = await Product.findById(id).lean();
      const updated = await Product.findByIdAndUpdate(id, data, { new: true });
      if (existing && Array.isArray(data.images)) {
        const removedImages = (existing.images || []).filter((img) => !data.images.includes(img));
        await cleanupOrphanedProductImages(removedImages);
      }
      return updated;
    }
    const index = fileDb.products.findIndex(p => p._id === id || String(p.id) === String(id));
    if (index === -1) return null;
    const previousImages = fileDb.products[index].images || [];
    fileDb.products[index] = {
      ...fileDb.products[index],
      ...data,
      status: data.status || fileDb.products[index].status || 'available',
      updatedAt: new Date().toISOString()
    };
    saveFallbackDb();
    if (Array.isArray(data.images)) {
      const removedImages = previousImages.filter((img) => !data.images.includes(img));
      await cleanupOrphanedProductImages(removedImages);
    }
    return fileDb.products[index];
  },

  async deleteProduct(id) {
    if (isMongoConnected()) {
      const removed = await Product.findByIdAndDelete(id);
      if (removed) {
        await cleanupOrphanedProductImages(removed.images || []);
      }
      return removed;
    }
    const index = fileDb.products.findIndex(p => p._id === id || String(p.id) === String(id));
    if (index === -1) return null;
    const [removed] = fileDb.products.splice(index, 1);
    saveFallbackDb();
    if (removed) {
      await cleanupOrphanedProductImages(removed.images || []);
    }
    return removed;
  },

  // ENQUIRIES
  async createEnquiry(data) {
    if (isMongoConnected()) {
      const enq = new Enquiry(data);
      return await enq.save();
    }
    const newEnq = {
      _id: `enq_${Date.now()}`,
      status: 'new',
      ...data,
      createdAt: new Date().toISOString()
    };
    fileDb.enquiries.push(newEnq);
    saveFallbackDb();
    return newEnq;
  },

  async getEnquiries() {
    if (isMongoConnected()) {
      return await Enquiry.find().sort({ createdAt: -1 });
    }
    return [...fileDb.enquiries].reverse();
  },

  async updateEnquiryStatus(id, status) {
    if (isMongoConnected()) {
      return await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
    }
    const item = fileDb.enquiries.find(e => e._id === id);
    if (item) {
      item.status = status;
      saveFallbackDb();
    }
    return item;
  },

  // QUOTATIONS
  async createQuotation(data) {
    if (isMongoConnected()) {
      const quote = new Quotation(data);
      return await quote.save();
    }
    const newQuote = {
      _id: `quot_${Date.now()}`,
      status: 'pending',
      ...data,
      createdAt: new Date().toISOString()
    };
    fileDb.quotations.push(newQuote);
    saveFallbackDb();
    return newQuote;
  },

  async getQuotations() {
    if (isMongoConnected()) {
      return await Quotation.find().sort({ createdAt: -1 });
    }
    return [...fileDb.quotations].reverse();
  },

  async updateQuotationStatus(id, status) {
    if (isMongoConnected()) {
      return await Quotation.findByIdAndUpdate(id, { status }, { new: true });
    }
    const item = fileDb.quotations.find(q => q._id === id);
    if (item) {
      item.status = status;
      saveFallbackDb();
    }
    return item;
  },

  // REVIEWS
  async getReviews() {
    if (isMongoConnected()) {
      return await Review.find().sort({ createdAt: -1 });
    }
    if (!fileDb.reviews || fileDb.reviews.length === 0) {
      fileDb.reviews = [...initialReviews];
      saveFallbackDb();
    }
    return [...fileDb.reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createReview(data) {
    if (isMongoConnected()) {
      const rev = new Review(data);
      return await rev.save();
    }
    if (!fileDb.reviews) fileDb.reviews = [...initialReviews];
    const newRev = {
      _id: `rev_${Date.now()}`,
      rating: Number(data.rating) || 5,
      verified: true,
      ...data,
      createdAt: new Date().toISOString()
    };
    fileDb.reviews.unshift(newRev);
    saveFallbackDb();
    return newRev;
  },

  // STATS
  async getStats() {
    const prods = await this.getProducts();
    const enqs = await this.getEnquiries();
    const quotes = await this.getQuotations();

    const tractors = prods.filter(p => p.category === 'tractor').length;
    const cars = prods.filter(p => p.category === 'car').length;
    const spares = prods.filter(p => p.category === 'spare_part').length;
    const totalInventoryValue = prods.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

    return {
      totalProducts: prods.length,
      tractorsCount: tractors,
      carsCount: cars,
      sparesCount: spares,
      totalInventoryValue,
      totalEnquiries: enqs.length,
      newEnquiries: enqs.filter(e => e.status === 'new').length,
      totalQuotations: quotes.length,
      pendingQuotations: quotes.filter(q => q.status === 'pending').length,
      dbMode: isMongoConnected() ? 'MongoDB Atlas / Local' : 'Local Persistent JSON'
    };
  }
};

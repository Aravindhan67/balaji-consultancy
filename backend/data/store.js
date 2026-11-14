import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Enquiry } from '../models/Enquiry.js';
import { Quotation } from '../models/Quotation.js';
import { initialProducts } from '../seed/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, 'db.json');

// Memory/File-based fallback store
let fileDb = {
  products: [],
  enquiries: [],
  quotations: []
};

// Check if Mongoose is connected
export const isMongoConnected = () => mongoose.connection.readyState === 1;

// Load file-based fallback
export const initFallbackDb = () => {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf8');
      fileDb = JSON.parse(raw);
    } else {
      fileDb = {
        products: initialProducts.map((p, idx) => ({
          _id: `prod_${idx + 1}`,
          ...p,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
        enquiries: [],
        quotations: []
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
  } catch (err) {
    console.error('Failed to seed MongoDB:', err.message);
  }
};

// --- DATA ACCESS LAYER ---
export const DataStore = {
  // PRODUCTS
  async getProducts(filter = {}) {
    if (isMongoConnected()) {
      const query = {};
      if (filter.category && filter.category !== 'all') {
        query.category = filter.category;
      }
      if (filter.brand && filter.brand !== 'all') {
        query.brand = new RegExp(filter.brand, 'i');
      }
      if (filter.search) {
        query.$or = [
          { title: new RegExp(filter.search, 'i') },
          { brand: new RegExp(filter.search, 'i') },
          { description: new RegExp(filter.search, 'i') },
          { rtoPassing: new RegExp(filter.search, 'i') }
        ];
      }
      if (filter.minPrice) query.price = { ...(query.price || {}), $gte: Number(filter.minPrice) };
      if (filter.maxPrice) query.price = { ...(query.price || {}), $lte: Number(filter.maxPrice) };
      if (filter.featured !== undefined) query.featured = filter.featured === 'true' || filter.featured === true;

      return await Product.find(query).sort({ createdAt: -1 });
    }

    // Fallback store
    let items = [...fileDb.products];
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
      const prod = new Product(data);
      return await prod.save();
    }
    const newProd = {
      _id: `prod_${Date.now()}`,
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
      return await Product.findByIdAndUpdate(id, data, { new: true });
    }
    const index = fileDb.products.findIndex(p => p._id === id || String(p.id) === String(id));
    if (index === -1) return null;
    fileDb.products[index] = {
      ...fileDb.products[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    saveFallbackDb();
    return fileDb.products[index];
  },

  async deleteProduct(id) {
    if (isMongoConnected()) {
      return await Product.findByIdAndDelete(id);
    }
    const index = fileDb.products.findIndex(p => p._id === id || String(p.id) === String(id));
    if (index === -1) return null;
    const removed = fileDb.products.splice(index, 1);
    saveFallbackDb();
    return removed[0];
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

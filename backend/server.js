import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Permissive & Production-Ready CORS configuration
const allowedOrigins = [
  'https://balaji-consultancy.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Allow Vercel production and preview deployment URLs (*.vercel.app)
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Default allow to ensure zero client-side blocks
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Explicit Preflight Handler
app.options('*', cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically with Cross-Origin headers
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cache-Control', 'public, max-age=86400');
  }
}));

// Root Health Endpoint (Render ping & monitoring)
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Balaji Auto & Agro Consultancy Backend API',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    documentation: {
      health: '/api/health',
      products: '/api/products',
      uploads: '/uploads/'
    }
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Balaji Auto & Agro Consultancy API',
    timestamp: new Date().toISOString(),
    uploadsDirectory: uploadsPath,
    environment: process.env.NODE_ENV || 'production'
  });
});

// Serve frontend dist if running monolithically
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚜 Balaji Auto & Agro Consultancy Backend Active!`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`🔗 Allowed Client: https://balaji-consultancy.vercel.app`);
    console.log(`📸 Image Storage: /uploads/`);
    console.log(`=======================================================`);
  });
});

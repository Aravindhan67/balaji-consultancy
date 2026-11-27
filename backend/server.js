import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { isCloudinaryConfigured } from './config/cloudinary.js';

import productRoutes from './routes/productRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
app.disable('x-powered-by');

// Security response headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Strict Production-Ready CORS configuration
const allowedOrigins = [
  'https://balaji-consultancy.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    // Allow configured origins, Vercel preview/production deployments, and local dev ports
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));

// Explicit Preflight Handler
app.options('*', cors(corsOptions));

// Body parsers with explicit payload limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Serve uploaded images statically with security & Cross-Origin headers
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res) => {
    res.set('X-Content-Type-Options', 'nosniff');
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
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Balaji Auto & Agro Consultancy API',
    timestamp: new Date().toISOString(),
    mediaStorage: isCloudinaryConfigured() ? 'Cloudinary' : 'Local Disk',
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
  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚜 Balaji Auto & Agro Consultancy Backend Active!`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`🔗 Allowed Client: https://balaji-consultancy.vercel.app`);
    console.log(`📸 Image Storage: /uploads/`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`\n⚠️  Port ${PORT} is already in use by another process.`);
      console.warn(`👉 A backend instance is already running on http://localhost:${PORT}`);
      console.warn(`👉 To free the port on Windows PowerShell, run:\n   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
    } else {
      console.error('Server error:', err);
    }
  });
});

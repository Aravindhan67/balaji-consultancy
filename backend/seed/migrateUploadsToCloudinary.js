import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { isCloudinaryConfigured } from '../config/cloudinary.js';
import { connectDB } from '../config/db.js';
import { isMongoConnected } from '../data/store.js';
import { Product } from '../models/Product.js';
import { Quotation } from '../models/Quotation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.join(__dirname, '..');
const uploadsDir = path.join(backendDir, 'uploads');
const dbJsonPath = path.join(backendDir, 'data', 'db.json');

dotenv.config({ path: path.join(backendDir, '.env') });

const getResourceType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (['.mp4', '.webm', '.mov'].includes(ext)) return 'video';
  if (['.pdf', '.doc', '.docx', '.txt'].includes(ext)) return 'raw';
  return 'image';
};

const runMigration = async () => {
  if (!isCloudinaryConfigured()) {
    console.error('❌ Cloudinary is not configured yet in backend/.env.');
    console.error('   Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env first.');
    process.exit(1);
  }

  if (!fs.existsSync(uploadsDir)) {
    console.log('No backend/uploads directory found. Nothing to migrate.');
    process.exit(0);
  }

  const files = fs.readdirSync(uploadsDir).filter((name) => {
    const full = path.join(uploadsDir, name);
    return fs.statSync(full).isFile();
  });

  if (files.length === 0) {
    console.log('backend/uploads is empty. Nothing to migrate.');
    process.exit(0);
  }

  const baseFolder = (process.env.CLOUDINARY_FOLDER || 'balaji-consultancy').trim();
  const urlMap = new Map();
  let uploadedCount = 0;
  let failedCount = 0;

  console.log(`☁️  Uploading ${files.length} files from backend/uploads to Cloudinary folder "${baseFolder}/uploads"...`);

  for (const filename of files) {
    const filePath = path.join(uploadsDir, filename);
    const ext = path.extname(filename);
    const publicId = path.basename(filename, ext);
    const resourceType = getResourceType(filename);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `${baseFolder}/uploads`,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: true,
        unique_filename: false
      });
      urlMap.set(`/uploads/${filename}`, result.secure_url);
      urlMap.set(filename, result.secure_url);
      uploadedCount += 1;
      console.log(`  ✅ ${filename} -> ${result.secure_url}`);
    } catch (err) {
      failedCount += 1;
      console.error(`  ❌ Failed ${filename}: ${err.message}`);
    }
  }

  const replaceUrl = (val) => {
    if (typeof val !== 'string') return val;
    if (urlMap.has(val)) return urlMap.get(val);
    const match = val.match(/\/uploads\/([^/?#]+)$/i);
    if (match && urlMap.has(`/uploads/${match[1]}`)) {
      return urlMap.get(`/uploads/${match[1]}`);
    }
    return val;
  };

  // Update backend/data/db.json
  let jsonUpdated = 0;
  if (fs.existsSync(dbJsonPath)) {
    const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
    if (Array.isArray(dbData.products)) {
      dbData.products = dbData.products.map((prod) => {
        if (!Array.isArray(prod.images)) return prod;
        const nextImages = prod.images.map(replaceUrl);
        if (JSON.stringify(nextImages) !== JSON.stringify(prod.images)) {
          jsonUpdated += 1;
          return { ...prod, images: nextImages };
        }
        return prod;
      });
    }
    if (Array.isArray(dbData.quotations)) {
      dbData.quotations = dbData.quotations.map((q) => {
        if (!Array.isArray(q.photos)) return q;
        const nextPhotos = q.photos.map(replaceUrl);
        if (JSON.stringify(nextPhotos) !== JSON.stringify(q.photos)) {
          jsonUpdated += 1;
          return { ...q, photos: nextPhotos };
        }
        return q;
      });
    }
    fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
  }

  // Update MongoDB if reachable
  let mongoUpdated = 0;
  try {
    await connectDB();
    if (isMongoConnected()) {
      const products = await Product.find({});
      for (const prod of products) {
        if (!Array.isArray(prod.images)) continue;
        const nextImages = prod.images.map(replaceUrl);
        if (JSON.stringify(nextImages) !== JSON.stringify(prod.images)) {
          prod.images = nextImages;
          await prod.save();
          mongoUpdated += 1;
        }
      }
      const quotations = await Quotation.find({});
      for (const q of quotations) {
        if (!Array.isArray(q.photos)) continue;
        const nextPhotos = q.photos.map(replaceUrl);
        if (JSON.stringify(nextPhotos) !== JSON.stringify(q.photos)) {
          q.photos = nextPhotos;
          await q.save();
          mongoUpdated += 1;
        }
      }
    }
  } catch (err) {
    console.warn('⚠️  MongoDB update skipped:', err.message);
  }

  console.log('\n🎉 Cloudinary Migration Summary:');
  console.log(`   Uploaded: ${uploadedCount} files (${failedCount} failed)`);
  console.log(`   Updated in db.json: ${jsonUpdated} records`);
  console.log(`   Updated in MongoDB: ${mongoUpdated} records`);
  process.exit(failedCount > 0 ? 1 : 0);
};

runMigration();

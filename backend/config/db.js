import mongoose from 'mongoose';
import dns from 'dns';
import { initFallbackDb, seedMongoIfEmpty } from '../data/store.js';

// Ensure reliable SRV resolution on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not permitted
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/balaji_consultancy';
  
  // Initialize fallback DB so data is always accessible
  initFallbackDb();

  if (uri.includes('<db_password>')) {
    console.warn('⚠️  Notice: MongoDB Atlas URI contains the placeholder "<db_password>".');
    console.log('📁 Using built-in persistent storage (backend/data/db.json).');
    return;
  }

  try {
    console.log(`Connecting to MongoDB Atlas: ${uri.replace(/\/\/.*@/, '//***:***@')}...`);
    
    // Safety timeout of 5 seconds to prevent startup hang if network/DNS is blocked
    const connectPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000
    });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timed out after 5000ms')), 5000)
    );

    await Promise.race([connectPromise, timeoutPromise]);
    console.log('✅ MongoDB Atlas connected successfully!');
    await seedMongoIfEmpty();
  } catch (err) {
    console.warn('⚠️  MongoDB connection notice:', err.message);
    if (err.message.includes('whitelist') || err.message.includes('Could not connect to any servers')) {
      console.log('👉 Tip: Please allow your IP in MongoDB Atlas: Security > Network Access > Add IP Address > "0.0.0.0/0" (Allow from anywhere)');
    }
    console.log('📁 In the meantime, using built-in persistent storage (backend/data/db.json). Zero downtime!');
  }
};

import express from 'express';
import { DataStore } from '../data/store.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all products with filtering
router.get('/', async (req, res) => {
  try {
    const products = await DataStore.getProducts(req.query);
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await DataStore.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product / Vehicle not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create new product (Protected)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, category, price, brand } = req.body;
    if (!title || !category || !price || !brand) {
      return res.status(400).json({ success: false, message: 'Title, category, brand, and price are required' });
    }
    const product = await DataStore.createProduct(req.body);
    res.status(201).json({ success: true, message: 'Item created successfully', data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update product (Protected)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await DataStore.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Item updated successfully', data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE product (Protected)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await DataStore.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

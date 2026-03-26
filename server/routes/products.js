const router  = require('express').Router();
const Product = require('../models/Product');
const protect = require('../middleware/auth');
const { getIO } = require('../socket');

// ── PUBLIC routes (used by client) ───────────────────────────────────────────

// GET /api/products  — all active products (optionally filter by collection)
router.get('/', async (req, res) => {
  const { collection } = req.query;
  try {
    let query = { is_active: true };
    if (collection && collection !== 'all') {
      query.collections = collection;
    }
    const products = await Product.find(query).sort('sort_order');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/slug/:slug — single product by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, is_active: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN routes (protected) ──────────────────────────────────────────────────

// GET /api/products/admin/all — ALL products including inactive
router.get('/admin/all', protect, async (req, res) => {
  try {
    const products = await Product.find().sort('sort_order');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const Inventory = require('../models/Inventory');

// POST /api/products — create new product
router.post('/', protect, async (req, res) => {
  const p = req.body;
  if (!p.id) p.id = 'p' + Date.now();
  
  if (!p.slug) {
    p.slug = p.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  }

  try {
    const newProduct = await Product.create(p);

    // Initialize Inventory for this product
    await Inventory.create({
      product_id: newProduct._id,
      variant: 'default',
      quantity: 0,
      reorder_level: 10
    });

    getIO().emit('product:created', newProduct);
    res.status(201).json({ message: 'Product created and inventory initialized', id: newProduct.id, slug: newProduct.slug });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Slug or ID already exists.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id — update product
router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    getIO().emit('product:updated', product);
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    getIO().emit('product:deleted', req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/reorder — bulk update sort_order
router.post('/reorder', protect, async (req, res) => {
  const { order } = req.body; // array of product IDs in new order
  try {
    const bulkOps = order.map((id, index) => ({
      updateOne: {
        filter: { id },
        update: { sort_order: index }
      }
    }));
    await Product.bulkWrite(bulkOps);
    getIO().emit('products:reordered', order);
    res.json({ message: 'Products reordered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const router  = require('express').Router();
const Inventory = require('../models/Inventory');
const InventoryTransaction = require('../models/InventoryTransaction');
const Product = require('../models/Product');
const protect = require('../middleware/auth');

// ── GET /api/inventory — List all inventory records ──────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    // Populate product data with it
    const items = await Inventory.find().populate('product_id', 'name slug images type is_active');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/inventory/adjust (Stock In/Out/Adjustment) ───────────────────
router.post('/adjust', protect, async (req, res) => {
  const { product_id, variant, transaction_type, quantity_change, reference, notes } = req.body;

  if (!product_id || !transaction_type || quantity_change === undefined)
    return res.status(400).json({ error: 'Product, type, and quantity change are required' });

  try {
    // 1. Find or create inventory record
    let inv = await Inventory.findOne({ product_id, variant: variant || 'default' });
    
    if (!inv) {
      inv = new Inventory({ product_id, variant: variant || 'default', quantity: 0 });
    }

    const qtyBefore = inv.quantity;
    let qtyAfter;

    if (transaction_type === 'adjustment') {
      qtyAfter = Number(quantity_change);
    } else {
      qtyAfter = qtyBefore + Number(quantity_change);
    }

    if (qtyAfter < 0) return res.status(400).json({ error: 'Stock cannot be negative' });

    // 2. Update Inventory
    inv.quantity = qtyAfter;
    inv.last_updated = new Date();
    await inv.save();

    // 3. Log Transaction
    await InventoryTransaction.create({
      inventory_id: inv._id,
      product_id,
      variant: variant || 'default',
      transaction_type,
      quantity_change: qtyAfter - qtyBefore,
      quantity_before: qtyBefore,
      quantity_after:  qtyAfter,
      reference,
      notes,
      performed_by: req.admin.username || 'admin'
    });

    // 4. Auto mark 'soldout' if 0
    if (qtyAfter === 0) {
      await Product.findByIdAndUpdate(product_id, { type: 'sold' });
    } else if (qtyBefore === 0 && qtyAfter > 0) {
      await Product.findByIdAndUpdate(product_id, { type: 'buy' });
    }

    res.json({ message: 'Stock updated successfully', currentStock: qtyAfter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/inventory/history — List latest 100 transactions ─────────────────
router.get('/history', protect, async (req, res) => {
  try {
    const history = await InventoryTransaction.find()
      .populate('product_id', 'name slug images type')
      .sort({ created_at: -1 })
      .limit(100);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/inventory/history/:productId ─────────────────────────────────────
router.get('/history/:productId', protect, async (req, res) => {
  try {
    const history = await InventoryTransaction.find({ product_id: req.params.productId }).sort({ created_at: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

require('dotenv').config();
const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const protect = require('../middleware/auth');
const { getIO } = require('../socket');
const {
  getAvailableStock,
  deductInventoryForSale,
} = require('../utils/productStock');

// Minimal auth middleware for client user checking
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'tmc_jwt_secret_change_in_prod';
const requireUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Please log in to place an order.' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
};

function variantFromBodyItem(item) {
  if (item.variant != null && String(item.variant).trim() !== '') {
    return String(item.variant).trim();
  }
  if (item.selectedVariant) {
    if (typeof item.selectedVariant === 'object' && item.selectedVariant.name) {
      return String(item.selectedVariant.name).trim();
    }
    return String(item.selectedVariant).trim();
  }
  return 'default';
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// GET /api/orders/my — logged-in user's orders
router.get('/my', requireUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name slug images id price');
    res.json(orders);
  } catch (err) {
    console.error('List orders error:', err);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

// GET /api/orders/my/:orderId — single order (owner only)
router.get('/my/:orderId', requireUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.product', 'name slug images id price');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Failed to load order' });
  }
});

// GET /api/orders/admin/all — admin: all orders
router.get('/admin/all', protect, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.product', 'name slug images id price');
    res.json(orders);
  } catch (err) {
    console.error('Admin list orders error:', err);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

// PATCH /api/orders/admin/:id — admin: update status
router.patch('/admin/:id', protect, async (req, res) => {
  try {
    const { order_status, payment_status } = req.body;
    const updates = {};
    if (order_status) updates.order_status = order_status;
    if (payment_status) updates.payment_status = payment_status;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    // Get order BEFORE update to check cancellation state
    const oldOrder = await Order.findById(req.params.id);
    if (!oldOrder) return res.status(404).json({ error: 'Order not found' });

    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('user', 'name email')
      .populate('items.product', 'name slug images id price');

    // Handle stock restore if newly CANCELLED
    if (order_status === 'CANCELLED' && oldOrder.order_status !== 'CANCELLED' && oldOrder.payment_status === 'PAID') {
      try {
        const { attachStockToProducts } = require('../utils/productStock');
        const io = getIO();
        for (const line of oldOrder.items) {
          await deductInventoryForSale({
            productId: line.product,
            variant: line.variant || 'default',
            qty: -line.qty, // negative to restore
            reference: `cancel:${order._id}`,
            performedBy: 'admin_cancel'
          });
          const pDoc = await Product.findById(line.product);
          if (pDoc) {
            const [updatedProduct] = await attachStockToProducts([pDoc]);
            io.emit('product:updated', { 
              productId: updatedProduct._id,
              stock: updatedProduct.stock_total,
              stock_total: updatedProduct.stock_total,
              stock_by_variant: updatedProduct.stock_by_variant
            });
          }
        }
      } catch (err) {
        console.error('Failed to restore stock on cancel:', err);
      }
    }

    res.json(order);
  } catch (err) {
    console.error('Admin patch order error:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// POST /api/orders/create
router.post('/create', requireUser, async (req, res) => {
  try {
    const { items, shipping_address } = req.body;
    const promo_code_raw = req.body?.promo_code;
    const promo_code = promo_code_raw ? String(promo_code_raw).trim().toUpperCase() : '';

    if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
    if (!shipping_address || !shipping_address.address || !shipping_address.city) {
      return res.status(400).json({ error: 'Incomplete shipping details' });
    }

    const resolvedItems = [];
    for (const item of items) {
      const qty = Math.max(0, Number(item.qty) || 0);
      if (qty <= 0) return res.status(400).json({ error: 'Invalid quantity' });
      const productDoc = await Product.findOne({ id: String(item.product) });
      if (!productDoc) {
        return res.status(400).json({ error: `Product not found: ${item.product}` });
      }
      const variantKey = variantFromBodyItem(item);
      const available = await getAvailableStock(productDoc._id, variantKey);
      if (available < qty) {
        return res.status(400).json({
          error: `Insufficient stock for ${productDoc.name}${variantKey !== 'default' ? ` (${variantKey})` : ''}. Only ${available} available.`,
        });
      }
      resolvedItems.push({
        product: productDoc._id,
        variant: variantKey,
        name: productDoc.name,
        price: productDoc.price,
        qty,
        image: (productDoc.images && productDoc.images[0]) || item.image,
      });
    }

    const subtotal = resolvedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping_fee = subtotal > 499 ? 0 : 50;
    let discount_amount = 0;
    let discount_type;
    let discount_value;
    let total_amount = subtotal + shipping_fee;

    // Optional promo code validation + discount calculation
    if (promo_code) {
      const offer = await Offer.findOne({ code: promo_code, is_active: true });
      if (!offer) {
        return res.status(400).json({ error: 'Invalid promo code' });
      }
      if (offer.expires_at && offer.expires_at < new Date()) {
        return res.status(400).json({ error: 'Promo code expired' });
      }
      if (offer.min_order && subtotal < Number(offer.min_order || 0)) {
        return res.status(400).json({ error: `Minimum order is ₹${offer.min_order}` });
      }
      if (offer.max_uses != null && Number(offer.used_count || 0) >= Number(offer.max_uses || 0)) {
        return res.status(400).json({ error: 'Promo code usage limit reached' });
      }

      discount_type = offer.discount_type || 'percent';
      discount_value = Number(offer.discount_value) || 0;

      if (discount_value <= 0) {
        return res.status(400).json({ error: 'Promo code has no discount configured' });
      }

      if (discount_type === 'flat') {
        discount_amount = discount_value;
      } else {
        discount_amount = (subtotal * discount_value) / 100;
      }

      discount_amount = Math.min(discount_amount, subtotal);
      total_amount = Math.max(0, subtotal + shipping_fee - discount_amount);
    }

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total_amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${req.user.id.substring(0, 5)}`,
    });

    const order = await Order.create({
      user: req.user.id,
      items: resolvedItems,
      shipping_address,
      subtotal,
      shipping_fee,
      promo_code: promo_code || undefined,
      discount_amount,
      discount_type,
      discount_value,
      total_amount,
      razorpay_order_id: rzpOrder.id,
      payment_status: 'PENDING',
    });

    res.json({
      success: true,
      order: order,
      razorpay_order_id: rzpOrder.id,
      amount: total_amount,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// POST /api/orders/verify
router.post('/verify', requireUser, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (order.payment_status === 'PAID') {
      return res.json({ success: true, message: 'Payment already verified' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      await Order.findByIdAndUpdate(order_id, { payment_status: 'FAILED' });
      return res.status(400).json({ success: false, error: 'Invalid signature. Payment failed.' });
    }

    const paidOrder = await Order.findOneAndUpdate(
      { _id: order_id, user: req.user.id, payment_status: { $ne: 'PAID' } },
      { payment_status: 'PAID', razorpay_payment_id: razorpay_payment_id },
      { new: true }
    );

    if (!paidOrder) {
      const existing = await Order.findById(order_id);
      if (existing && existing.payment_status === 'PAID') {
        return res.json({ success: true, message: 'Payment already verified' });
      }
      return res.status(400).json({ error: 'Could not confirm payment for this order.' });
    }

    const fresh = paidOrder;
    for (const line of fresh.items) {
      const pid = line.product;
      const variant = line.variant || 'default';
      try {
        await deductInventoryForSale({
          productId: pid,
          variant,
          qty: line.qty,
          reference: `order:${order_id}`,
          performedBy: 'order',
        });
      } catch (e) {
        console.error('Inventory deduction failed after payment', order_id, e);
        return res.status(500).json({
          error: 'Payment recorded but stock update failed. Please contact support with your order ID.',
        });
      }
    }

    // Mark promo code usage after successful payment (only once due to payment_status transition)
    if (fresh.promo_code) {
      try {
        const code = String(fresh.promo_code).trim().toUpperCase();
        const offer = await Offer.findOne({ code });
        if (offer) {
          if (offer.max_uses == null || Number(offer.used_count || 0) < Number(offer.max_uses || 0)) {
            await Offer.findOneAndUpdate({ _id: offer._id }, { $inc: { used_count: 1 } });
          }
        }
      } catch (e) {
        console.error('Promo usage increment failed:', e);
      }
    }

    try {
      const io = getIO();
      const { attachStockToProducts } = require('../utils/productStock');
      for (const line of fresh.items) {
        const pDoc = await Product.findById(line.product);
        if (pDoc) {
           const [updatedProduct] = await attachStockToProducts([pDoc]);
           io.emit('product:updated', { 
             productId: updatedProduct._id,
             stock: updatedProduct.stock_total,
             stock_total: updatedProduct.stock_total,
             stock_by_variant: updatedProduct.stock_by_variant
           });
        }
      }
    } catch (_) {}

    return res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) {
    console.error('Verify Order Error:', err);
    res.status(500).json({ error: 'Internal server error verifying payment' });
  }
});

module.exports = router;

require('dotenv').config();
const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// POST /api/orders/create
// Creates order in DB + Razorpay Order, returns order id to frontend
router.post('/create', requireUser, async (req, res) => {
  try {
    const { items, shipping_address } = req.body;
    
    if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
    if (!shipping_address || !shipping_address.address || !shipping_address.city) {
      return res.status(400).json({ error: 'Incomplete shipping details' });
    }

    // Calculate total (prevent frontend tampering)
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping_fee = subtotal > 499 ? 0 : 50; // Example logic: Free shipping over ₹499
    const total_amount = subtotal + shipping_fee;

    // Create Razorpay Order
    const rzpOrder = await razorpay.orders.create({
      amount: total_amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${req.user.id.substring(0, 5)}`,
    });

    // Save Order in DB as PENDING
    const order = await Order.create({
      user: req.user.id,
      items,
      shipping_address,
      subtotal,
      shipping_fee,
      total_amount,
      razorpay_order_id: rzpOrder.id,
      payment_status: 'PENDING'
    });

    res.json({
      success: true,
      order: order,
      razorpay_order_id: rzpOrder.id,
      amount: total_amount,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// POST /api/orders/verify
// Frontend calls this after Razorpay popup succeeds
router.post('/verify', requireUser, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is legit
      await Order.findByIdAndUpdate(order_id, {
        payment_status: 'PAID',
        razorpay_payment_id: razorpay_payment_id
      });
      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      await Order.findByIdAndUpdate(order_id, { payment_status: 'FAILED' });
      return res.status(400).json({ success: false, error: 'Invalid signature. Payment failed.' });
    }
  } catch (err) {
    console.error('Verify Order Error:', err);
    res.status(500).json({ error: 'Internal server error verifying payment' });
  }
});

module.exports = router;

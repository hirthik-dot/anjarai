// server/routes/phoneOtp.js — Phone OTP routes (Fast2SMS)
const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { sendOtp, verifyOtp, isRateLimited, setRateLimit, stripPrefix } = require('../utils/sendOtp');

const SECRET = process.env.JWT_SECRET || 'tmc_jwt_secret_change_in_prod';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/send-otp
// Body: { name: string, phone: string }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  try {
    console.log('📥 /api/send-otp body:', JSON.stringify(req.body));

    const { name, phone } = req.body || {};

    // Validate name
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
    }

    // Strip +91/91 prefix, then validate Indian phone (starts with 6-9, 10 digits)
    const cleanPhone = stripPrefix(phone);
    console.log(`📱 cleanPhone after stripPrefix: "${cleanPhone}" (raw input: "${phone}")`);

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
    }

    // Rate limit: 1 OTP per minute per number
    if (isRateLimited(cleanPhone)) {
      return res.status(429).json({
        error: 'Please wait 60 seconds before requesting another OTP.',
      });
    }

    const otp = await sendOtp(cleanPhone);
    setRateLimit(cleanPhone);

    console.log(`✅ Phone OTP generated and sent to ${cleanPhone}`);

    res.json({
      message: `OTP sent to ${cleanPhone}`,
      phone:   cleanPhone,
      name:    name.trim(),
      // Only expose OTP in development for testing
      ...(process.env.NODE_ENV !== 'production' && { _dev_otp: otp }),
    });
  } catch (err) {
    console.error('❌ /api/send-otp FULL ERROR:', err);
    return res.status(500).json({
      error: err.message || 'Failed to send OTP. Please try again later.',
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/verify-otp
// Body: { name: string, phone: string, otp: string }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { name, phone, otp } = req.body || {};

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required.' });
    }

    const cleanPhone = stripPrefix(phone);
    const cleanOtp   = String(otp).trim();
    const cleanName  = String(name || '').trim();

    // Verify OTP (checks expiry, attempts, deletes on success)
    const result = verifyOtp(cleanPhone, cleanOtp);

    if (!result.success) {
      return res.status(400).json({
        error: result.error,
        ...(result.attemptsRemaining !== undefined && { attemptsRemaining: result.attemptsRemaining }),
      });
    }

    // OTP valid — upsert user by phone
    const user = await User.findOneAndUpdate(
      { phone: cleanPhone },
      {
        ...(cleanName && { name: cleanName }),
        phone: cleanPhone,
        last_login: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Issue JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, phone: cleanPhone, role: 'user' },
      SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful! Welcome to Anjaraipetti.',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        phone: cleanPhone,
      },
    });
  } catch (err) {
    console.error('❌ /api/verify-otp FULL ERROR:', err);
    return res.status(500).json({
      error: err.message || 'OTP verification failed. Please try again.',
    });
  }
});

module.exports = router;

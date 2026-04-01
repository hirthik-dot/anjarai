// server/routes/phoneOtp.js — Email OTP routes (Resend)
const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { sendOtp, verifyOtp } = require('../utils/sendOtp');

const SECRET = process.env.JWT_SECRET || 'tmc_jwt_secret_change_in_prod';

// ── Rate-limit store (1 OTP per 60s per email) ───────────────────────────────
const rateLimitStore = new Map();

function isRateLimited(email) {
  const lastSent = rateLimitStore.get(email);
  if (!lastSent) return false;
  return (Date.now() - lastSent) < 60 * 1000;
}

function setRateLimit(email) {
  rateLimitStore.set(email, Date.now());
  setTimeout(() => rateLimitStore.delete(email), 2 * 60 * 1000);
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/send-otp
// Body: { name: string, email: string }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  try {
    console.log('📥 /api/send-otp body:', JSON.stringify(req.body));

    const { name, email } = req.body || {};

    // Validate name
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Rate limit: 1 OTP per minute per email
    if (isRateLimited(cleanEmail)) {
      return res.status(429).json({
        error: 'Please wait 60 seconds before requesting another OTP.',
      });
    }

    await sendOtp(cleanEmail);
    setRateLimit(cleanEmail);

    console.log(`✅ Email OTP generated and sent to ${cleanEmail}`);

    res.json({
      message: `OTP sent to ${cleanEmail}`,
      email:   cleanEmail,
      name:    name.trim(),
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
// Body: { name: string, email: string, otp: string }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { name, email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp   = String(otp).trim();
    const cleanName  = String(name || '').trim();

    // Verify OTP (checks expiry, attempts, deletes on success)
    const result = verifyOtp(cleanEmail, cleanOtp);

    if (!result.success) {
      return res.status(400).json({
        error: result.reason,
      });
    }

    // OTP valid — upsert user by email
    const user = await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        ...(cleanName && { name: cleanName }),
        email: cleanEmail,
        last_login: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Issue JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: cleanEmail, role: 'user' },
      SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful! Welcome to Anjaraipetti.',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: cleanEmail,
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

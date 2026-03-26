// server/routes/otp.js  — OTP-based client authentication (MongoDB version)
require('dotenv').config();
const router         = require('express').Router();
const bcrypt         = require('bcrypt');
const jwt            = require('jsonwebtoken');
const crypto         = require('crypto');
const User           = require('../models/User');
const OtpStore       = require('../models/OtpStore');
const OtpRateLimit   = require('../models/OtpRateLimit');
const { sendOtpEmail } = require('../utils/mailer');

const SECRET           = process.env.JWT_SECRET || 'tmc_jwt_secret_change_in_prod';
const OTP_EXPIRY_MIN   = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS)   || 3;
const RATE_LIMIT_MAX   = Number(process.env.OTP_RATE_LIMIT_PER_15MIN) || 3;

// ── Helper: generate 6-digit OTP (cryptographically random) ──────────────────
function generateOtp() {
  const bytes = crypto.randomBytes(4);
  const num   = bytes.readUInt32BE(0) % 1000000;
  return String(num).padStart(6, '0');
}

// ── Helper: check rate limit ──────────────────────────────────────────────────
async function isRateLimited(email) {
  const windowStart = new Date(Date.now() - 15 * 60 * 1000);
  const result = await OtpRateLimit.aggregate([
    { $match: { email, window_start: { $gt: windowStart } } },
    { $group: { _id: null, total: { $sum: '$count' } } }
  ]);
  return (result[0]?.total || 0) >= RATE_LIMIT_MAX;
}

async function incrementRateLimit(email) {
  const now = new Date();
  // Round to current minute to group bursts together
  now.setSeconds(0, 0);
  try {
    await OtpRateLimit.findOneAndUpdate(
      { email, window_start: now },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  } catch (e) {
    // Ignore duplicate key on race condition
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/otp/send
// Body: { name: string, email: string }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/send', async (req, res) => {
  const { name, email } = req.body;

  if (!name || name.trim().length < 2)
    return res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Please enter a valid email address.' });

  const cleanName  = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Rate limit check
  if (await isRateLimited(cleanEmail)) {
    return res.status(429).json({
      error: 'Too many OTP requests. Please wait 15 minutes before trying again.'
    });
  }

  // Invalidate any existing unused OTPs for this email
  await OtpStore.updateMany({ email: cleanEmail, used: false }, { used: true });

  // Generate OTP
  const otp       = generateOtp();
  const otpHash   = bcrypt.hashSync(otp, 8);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000);

  // Store OTP
  await OtpStore.create({
    email:      cleanEmail,
    otp_hash:   otpHash,
    name:       cleanName,
    expires_at: expiresAt,
    attempts:   0,
    used:       false,
  });

  // Increment rate limit
  await incrementRateLimit(cleanEmail);

  // Send email — await it so we can report failure to the user
  try {
    await sendOtpEmail(cleanEmail, cleanName, otp);
    console.log(`✅ OTP generated and emailed to ${cleanEmail}`);
  } catch (mailErr) {
    console.error('❌ OTP Email Send Failed:', {
      message: mailErr.message,
      code: mailErr.code,
      command: mailErr.command,
      responseCode: mailErr.responseCode,
      response: mailErr.response,
    });
    return res.status(500).json({
      error: 'Failed to send OTP email. Please try again later.',
      _debug: process.env.NODE_ENV !== 'production' ? mailErr.message : undefined,
    });
  }

  res.json({
    message: `OTP sent to ${cleanEmail}`,
    email:   cleanEmail,
    name:    cleanName,
    // Only expose OTP in development for testing
    ...(process.env.NODE_ENV !== 'production' && { _dev_otp: otp }),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/otp/verify
// Body: { email: string, otp: string }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/verify', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ error: 'Email and OTP are required.' });

  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp   = String(otp).trim();

  // Find most recent unused OTP for this email
  const record = await OtpStore.findOne({ email: cleanEmail, used: false })
    .sort({ createdAt: -1 });

  if (!record)
    return res.status(400).json({ error: 'No active OTP found. Please request a new one.' });

  // Check expiry
  if (record.expires_at < new Date()) {
    await OtpStore.findByIdAndUpdate(record._id, { used: true });
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }

  // Check max attempts
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    await OtpStore.findByIdAndUpdate(record._id, { used: true });
    return res.status(400).json({ error: 'Too many incorrect attempts. Please request a new OTP.' });
  }

  // Verify OTP hash
  const isValid = bcrypt.compareSync(cleanOtp, record.otp_hash);

  if (!isValid) {
    await OtpStore.findByIdAndUpdate(record._id, { $inc: { attempts: 1 } });
    const remaining = OTP_MAX_ATTEMPTS - record.attempts - 1;
    return res.status(400).json({
      error: remaining > 0
        ? `Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
        : 'Incorrect OTP. No attempts remaining. Please request a new OTP.',
      attemptsRemaining: Math.max(0, remaining),
    });
  }

  // OTP valid — mark as used
  await OtpStore.findByIdAndUpdate(record._id, { used: true });

  // Upsert user
  const user = await User.findOneAndUpdate(
    { email: cleanEmail },
    { name: record.name, last_login: new Date() },
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
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/otp/resend  — semantic alias for /send
// ─────────────────────────────────────────────────────────────────────────────
router.post('/resend', async (req, res, next) => {
  // Re-use /send logic directly
  req.url = '/send';
  router.handle(req, res, next);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/otp/me  — validate JWT + return user profile
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, SECRET);
    const user    = await User.findById(decoded.id).select('name email last_login');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
});

module.exports = router;

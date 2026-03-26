const router  = require('express').Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const ClientUser = require('../models/ClientUser');
const OtpToken = require('../models/OtpToken');
const { generateOTP, hashOTP, verifyOTP, otpExpiry } = require('../utils/otp');
const { sendOtpEmail } = require('../utils/mailer');

const CLIENT_SECRET = process.env.CLIENT_JWT_SECRET || 'anjaraipetti_client_jwt';

// ── POST /api/client/signup ───────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { full_name, email, phone, password } = req.body;

  if (!full_name || !email || !phone || !password)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const existing = await ClientUser.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hash = bcrypt.hashSync(password, 10);
    const client = await ClientUser.create({
      full_name,
      email: email.toLowerCase(),
      phone,
      password_hash: hash
    });

    // Send verification OTP
    const code = generateOTP();
    await OtpToken.create({
      target: email,
      code: hashOTP(code),
      purpose: 'client_verify',
      client_id: client._id,
      expires_at: otpExpiry()
    });

    // Background send to prevent blocking the response
    sendOtpEmail(email, full_name, code).catch(e => console.error('Silent OTP Fail:', e));

    res.status(201).json({ message: 'Account created! Verify your email to login.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/client/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const client = await ClientUser.findOne({ email: email.toLowerCase() });
    if (!client) return res.status(401).json({ error: 'Invalid credentials' });

    if (!bcrypt.compareSync(password, client.password_hash))
      return res.status(401).json({ error: 'Invalid credentials' });

    if (!client.email_verified)
      return res.status(403).json({ error: 'Please verify your email first', needsVerification: true });

    const token = jwt.sign({ id: client._id, email: client.email }, CLIENT_SECRET);
    res.json({ token, user: client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const router  = require('express').Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const Admin   = require('../models/Admin');
const AdminProfile = require('../models/AdminProfile');
const OtpToken = require('../models/OtpToken');
const protect = require('../middleware/auth');
const { generateOTP, hashOTP, verifyOTP, otpExpiry } = require('../utils/otp');
const { sendOtpEmail } = require('../utils/mailer');

const SECRET  = process.env.JWT_SECRET || 'tmc_jwt_secret_change_in_prod';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: 'Invalid username or password' });

    const valid = bcrypt.compareSync(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid username or password' });

    // Load profile
    const profile = await AdminProfile.findOne({ admin_id: admin._id });

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      token, 
      username: admin.username, 
      profileComplete: profile?.profile_complete === true,
      emailVerified:   profile?.email_verified === true,
      expiresIn:       '8h' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══ OTP PASSWORD CHANGE FLOW ══════════════════════════════════════════════════

// STEP 1 — POST /api/auth/request-password-otp (protected)
router.post('/request-password-otp', protect, async (req, res) => {
  try {
    const profile = await AdminProfile.findOne({ admin_id: req.admin.id });
    if (!profile || !profile.email)
      return res.status(400).json({ error: 'No email on file. Please complete your admin profile first.' });

    if (!profile.email_verified)
      return res.status(400).json({ error: 'Email not yet verified. Please verify in Profile settings first.' });

    // Check for existing valid OTP to prevent spam
    const existing = await OtpToken.findOne({
      admin_id: req.admin.id,
      purpose: 'password_change',
      used: false,
      expires_at: { $gt: new Date() },
      attempts: { $lt: 5 }
    });

    if (existing) {
      return res.json({ message: 'OTP already sent. Please check your email and wait 2 mins before requesting again.' });
    }

    const code    = generateOTP();
    const hashed  = hashOTP(code);
    const expires = otpExpiry();

    // Invalidate old OTPs
    await OtpToken.updateMany({ admin_id: req.admin.id, purpose: 'password_change' }, { used: true });

    // Save new OTP
    await OtpToken.create({
      target: profile.email,
      code: hashed,
      purpose: 'password_change',
      admin_id: req.admin.id,
      expires_at: expires
    });

    // Send OTP in background - don't block the response
    sendOtpEmail(profile.email, profile.full_name || 'Admin', code).catch(e => console.error('Silent Admin OTP Fail:', e));
    
    // Mask email for response
    const masked = profile.email.replace(/(.{1,2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);
    res.json({ message: `OTP sent to ${masked}. Valid for 15 minutes.` });
  } catch (err) {
    console.error('Password OTP Error:', err);
    res.status(500).json({ error: 'Failed to request OTP' });
  }
});

// STEP 2 — POST /api/auth/verify-password-otp (protected)
router.post('/verify-password-otp', protect, async (req, res) => {
  const { otp, newPassword, confirmPassword } = req.body;

  if (!otp || !newPassword || !confirmPassword)
    return res.status(400).json({ error: 'All fields are required' });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ error: 'Passwords do not match' });

  if (newPassword.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters' });

  try {
    const record = await OtpToken.findOne({
      admin_id: req.admin.id,
      purpose: 'password_change',
      used: false,
      expires_at: { $gt: new Date() }
    }).sort({ created_at: -1 });

    if (!record)
      return res.status(400).json({ error: 'OTP expired or not found' });

    if (record.attempts >= 5) {
      record.used = true;
      await record.save();
      return res.status(429).json({ error: 'Too many attempts. Request a new OTP.' });
    }

    if (!verifyOTP(otp.trim(), record.code)) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ error: `Incorrect OTP. ${5 - record.attempts} attempts left.` });
    }

    // Success! Update password.
    const admin = await Admin.findById(req.admin.id);
    admin.password_hash = bcrypt.hashSync(newPassword, 10);
    await admin.save();

    record.used = true;
    await record.save();

    res.json({ message: 'Password changed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me  (protected)
router.get('/me', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('username');
    const profile = await AdminProfile.findOne({ admin_id: req.admin.id });
    res.json({ id: admin._id, username: admin.username, profile: profile || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

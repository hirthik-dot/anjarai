const router  = require('express').Router();
const AdminProfile = require('../models/AdminProfile');
const OtpToken = require('../models/OtpToken');
const protect = require('../middleware/auth');
const { generateOTP, hashOTP, verifyOTP, otpExpiry } = require('../utils/otp');
const { sendOtpEmail } = require('../utils/mailer');

// ── GET /api/admin-profile (protected) ───────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const profile = await AdminProfile.findOne({ admin_id: req.admin.id });
    if (!profile) return res.json({ admin_id: req.admin.id, full_name: '', email: '', phone: '', email_verified: false, profile_complete: false });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/admin-profile (protected) ───────────────────────────────────────
router.put('/', protect, async (req, res) => {
  const { full_name, phone } = req.body;

  if (!full_name || full_name.trim().length < 2)
    return res.status(400).json({ error: 'Full name is required (min 2 characters)' });

  if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, '')))
    return res.status(400).json({ error: 'Valid 10-digit Indian phone number is required' });

  try {
    const profile = await AdminProfile.findOneAndUpdate(
      { admin_id: req.admin.id },
      { full_name: full_name.trim(), phone: phone.trim(), updated_at: new Date() },
      { upsert: true, new: true }
    );
    res.json({ message: 'Profile updated', profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/admin-profile/request-email-verify (protected) ─────────────────
router.post('/request-email-verify', protect, async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Valid email address is required' });

  try {
    // Check if this email is already taken by another admin
    const taken = await AdminProfile.findOne({ email, admin_id: { $ne: req.admin.id } });
    if (taken) return res.status(409).json({ error: 'This email is already in use' });

    const code = generateOTP();
    const expires = otpExpiry();

    // Invalidate old OTPs
    await OtpToken.updateMany({ admin_id: req.admin.id, purpose: 'email_verify' }, { used: true });

    // Save new OTP
    await OtpToken.create({
      target: email,
      code: hashOTP(code),
      purpose: 'email_verify',
      admin_id: req.admin.id,
      expires_at: expires
    });

    await sendOtpEmail(email, 'Admin', code);
    
    const masked = email.replace(/(.{1,2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);
    res.json({ message: `Verification OTP sent to ${masked}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/admin-profile/verify-email (protected) ─────────────────────────
router.post('/verify-email', protect, async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

  try {
    const record = await OtpToken.findOne({
      admin_id: req.admin.id,
      purpose: 'email_verify',
      target: email,
      used: false,
      expires_at: { $gt: new Date() }
    }).sort({ created_at: -1 });

    if (!record) return res.status(400).json({ error: 'OTP expired or not found' });

    if (!verifyOTP(otp.trim(), record.code)) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ error: 'Incorrect OTP' });
    }

    // Success! Update profile.
    await AdminProfile.findOneAndUpdate(
      { admin_id: req.admin.id },
      { email, email_verified: true, profile_complete: true, updated_at: new Date() },
      { upsert: true }
    );

    record.used = true;
    await record.save();

    res.json({ message: 'Email verified successfully!', emailVerified: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

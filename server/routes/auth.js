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

// POST /api/auth/login  (email + password)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const cleanEmail = email.trim().toLowerCase();

    // Find admin via their profile email
    const profile = await AdminProfile.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
    if (!profile) return res.status(401).json({ error: 'Invalid email or password' });

    const admin = await Admin.findById(profile.admin_id);
    if (!admin) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = bcrypt.compareSync(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: admin._id, username: cleanEmail },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      token, 
      username: cleanEmail,
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

// RESET PASSWORD ROUTE (FORGOT PASSWORD)
router.post('/forgot-password-otp', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Valid email address is required' });

  const cleanEmail = email.trim().toLowerCase();

  try {
    // Find admin by email in AdminProfile (case-insensitive search)
    const profile = await AdminProfile.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
    if (!profile) return res.status(404).json({ error: 'No account found with this email' });

    const code    = generateOTP();
    const hashed  = hashOTP(code);
    const expires = otpExpiry();

    // Invalidate old OTPs (using cleanEmail)
    await OtpToken.updateMany({ target: cleanEmail, purpose: 'forgot_password' }, { used: true });

    // Save new OTP (store cleanEmail as target)
    await OtpToken.create({
      target: cleanEmail,
      code: hashed,
      purpose: 'forgot_password',
      admin_id: profile.admin_id,
      expires_at: expires
    });

    await sendOtpEmail(cleanEmail, profile.full_name || 'Admin', code);
    
    const masked = cleanEmail.replace(/(.{1,2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);
    res.json({ message: `Reset OTP sent to ${masked}` });
  } catch (err) {
    console.error('forgot-password-otp error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/reset-password-with-otp', async (req, res) => {
  const { otp, email, newUsername, newPassword, confirmPassword } = req.body;

  if (!otp || !email || !newPassword || !confirmPassword)
    return res.status(400).json({ error: 'All fields are required' });

  const cleanEmail = email.trim().toLowerCase();

  if (newPassword !== confirmPassword)
    return res.status(400).json({ error: 'Passwords do not match' });

  try {
    // Lookup OTP using cleanEmail (case-insensitive match on target)
    const record = await OtpToken.findOne({
      target: { $regex: new RegExp(`^${cleanEmail}$`, 'i') },
      purpose: 'forgot_password',
      used: false,
      expires_at: { $gt: new Date() }
    }).sort({ created_at: -1 });

    if (!record) return res.status(400).json({ error: 'OTP expired or not found. Please request a new one.' });

    if (!verifyOTP(otp.trim(), record.code)) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ error: 'Incorrect OTP' });
    }

    // Success! Update Admin
    const admin = await Admin.findById(record.admin_id);
    if (!admin) return res.status(404).json({ error: 'Admin account not found. Please contact support.' });

    admin.password_hash = bcrypt.hashSync(newPassword, 10);
    if (newUsername && newUsername.trim()) {
      // Remove any conflicting default 'admin' account first
      const conflicting = await Admin.findOne({ username: newUsername.trim(), _id: { $ne: admin._id } });
      if (conflicting) {
        await Admin.deleteOne({ _id: conflicting._id });
      }
      admin.username = newUsername.trim();
    }
    await admin.save();

    // Update Profile so login email stays in sync
    const newEmail = (newUsername && newUsername.trim()) ? newUsername.trim() : cleanEmail;
    await AdminProfile.findOneAndUpdate(
      { admin_id: admin._id },
      { email: newEmail, email_verified: true },
      { upsert: true }
    );

    record.used = true;
    await record.save();

    res.json({ message: 'Credentials reset successfully! Please login with your new details.' });
  } catch (err) {
    console.error('reset-password-with-otp error:', err.message, err.stack);
    res.status(500).json({ error: err.message });
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

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone:      { type: String, unique: true, sparse: true, trim: true },
  last_login: { type: Date, default: null },
  // Stored for admin convenience (OTP-based login verifies email/phone)
  email_verified: { type: Boolean, default: true },
  phone_verified: { type: Boolean, default: true },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

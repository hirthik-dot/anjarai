const mongoose = require('mongoose');

// OTP Store — one document per OTP attempt (not per user)
const OtpStoreSchema = new mongoose.Schema({
  email:      { type: String, required: true, lowercase: true, trim: true },
  otp_hash:   { type: String, required: true },   // bcrypt hash
  name:       { type: String, required: true },
  expires_at: { type: Date, required: true },
  attempts:   { type: Number, default: 0 },
  used:       { type: Boolean, default: false },
}, { timestamps: true });

OtpStoreSchema.index({ email: 1 });
OtpStoreSchema.index({ expires_at: 1 }, { expireAfterSeconds: 86400 }); // auto-delete after 24h

module.exports = mongoose.model('OtpStore', OtpStoreSchema);

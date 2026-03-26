const mongoose = require('mongoose');

// Rate limit tracking per email per 15-min window
const OtpRateLimitSchema = new mongoose.Schema({
  email:        { type: String, required: true, lowercase: true, trim: true },
  window_start: { type: Date, required: true },
  count:        { type: Number, default: 0 },
}, { timestamps: true });

OtpRateLimitSchema.index({ email: 1, window_start: 1 }, { unique: true });
OtpRateLimitSchema.index({ window_start: 1 }, { expireAfterSeconds: 7200 }); // auto-delete old windows

module.exports = mongoose.model('OtpRateLimit', OtpRateLimitSchema);

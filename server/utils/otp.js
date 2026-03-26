// server/utils/otp.js
const crypto = require('crypto');

// Generate a secure 6-digit OTP
const generateOTP = () => {
  const buffer = crypto.randomBytes(4);
  const num    = buffer.readUInt32BE(0);
  return String(100000 + (num % 900000));  // always 6 digits
};

// Simple hash for OTP storage
const hashOTP = (code) => {
  const salt = process.env.OTP_SALT || 'anjaraipetti_default_salt';
  return crypto.createHash('sha256').update(code + salt).digest('hex');
};

// Verify OTP against hash
const verifyOTP = (inputCode, storedHash) => {
  return hashOTP(inputCode) === storedHash;
};

// OTP expiry: 15 minutes from now
const otpExpiry = () => {
  return new Date(Date.now() + 15 * 60 * 1000);
};

module.exports = { generateOTP, hashOTP, verifyOTP, otpExpiry };

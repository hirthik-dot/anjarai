const mongoose = require('mongoose');

const OtpTokenSchema = new mongoose.Schema({
  target:      { type: String, required: true },  // email address
  code:        { type: String, required: true },  // hashed code
  purpose:     { type: String, enum: ['password_change', 'email_verify', 'client_verify'], required: true },
  admin_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  client_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'ClientUser' },
  attempts:    { type: Number, default: 0 },
  used:        { type: Boolean, default: false },
  expires_at:  { type: Date, required: true },
  created_at:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('OtpToken', OtpTokenSchema);

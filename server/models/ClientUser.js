const mongoose = require('mongoose');

const ClientUserSchema = new mongoose.Schema({
  full_name:       { type: String, required: true },
  email:           { type: String, unique: true, required: true },
  phone:           { type: String, required: true },
  password_hash:   { type: String, required: true },
  email_verified:  { type: Boolean, default: false },
  is_active:       { type: Boolean, default: true },
  last_login:      { type: Date },
  created_at:      { type: Date, default: Date.now },
  updated_at:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClientUser', ClientUserSchema);

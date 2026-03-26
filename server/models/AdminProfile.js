const mongoose = require('mongoose');

const AdminProfileSchema = new mongoose.Schema({
  admin_id:        { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true, unique: true },
  full_name:       { type: String, default: '' },
  email:           { type: String, unique: true, sparse: true },
  phone:           { type: String },
  email_verified:  { type: Boolean, default: false },
  profile_complete: { type: Boolean, default: false },
  updated_at:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminProfile', AdminProfileSchema);

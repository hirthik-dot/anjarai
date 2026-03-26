const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username:      { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);

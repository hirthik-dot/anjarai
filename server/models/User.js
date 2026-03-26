const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  last_login: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
